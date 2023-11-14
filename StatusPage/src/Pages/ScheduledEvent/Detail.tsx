import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState,
} from 'react';
import PageComponentProps from '../PageComponentProps';
import Page from '../../Components/Page/Page';
import URL from 'Common/Types/API/URL';
import PageLoader from 'CommonUI/src/Components/Loader/PageLoader';
import useAsyncEffect from 'use-async-effect';
import { JSONArray, JSONObject } from 'Common/Types/JSON';
import JSONFunctions from 'Common/Types/JSONFunctions';
import ErrorMessage from 'CommonUI/src/Components/ErrorMessage/ErrorMessage';
import BadDataException from 'Common/Types/Exception/BadDataException';
import LocalStorage from 'CommonUI/src/Utils/LocalStorage';
import ObjectID from 'Common/Types/ObjectID';
import ScheduledMaintenance from 'Model/Models/ScheduledMaintenance';
import ScheduledMaintenancePublicNote from 'Model/Models/ScheduledMaintenancePublicNote';
import OneUptimeDate from 'Common/Types/Date';
import ScheduledMaintenanceStateTimeline from 'Model/Models/ScheduledMaintenanceStateTimeline';
import RouteMap, { RouteUtil } from '../../Utils/RouteMap';
import PageMap from '../../Utils/PageMap';
import Route from 'Common/Types/API/Route';
import HTTPResponse from 'Common/Types/API/HTTPResponse';
import EventItem, {
    TimelineItem,
    ComponentProps as EventItemComponentProps,
    TimelineItemType,
} from 'CommonUI/src/Components/EventItem/EventItem';
import Navigation from 'CommonUI/src/Utils/Navigation';
import Color from 'Common/Types/Color';
import { Green, Grey, Yellow } from 'Common/Types/BrandColors';
import EmptyState from 'CommonUI/src/Components/EmptyState/EmptyState';
import IconProp from 'Common/Types/Icon/IconProp';
import API from '../../Utils/API';
import StatusPageUtil from '../../Utils/StatusPage';
import HTTPErrorResponse from 'Common/Types/API/HTTPErrorResponse';
import { STATUS_PAGE_API_URL } from '../../Utils/Config';
import StatusPageResource from 'Model/Models/StatusPageResource';
import Dictionary from 'Common/Types/Dictionary';
import Monitor from 'Model/Models/Monitor';
import Label from 'Model/Models/Label';

export const getScheduledEventEventItem: Function = (
    scheduledMaintenance: ScheduledMaintenance,
    scheduledMaintenanceEventsPublicNotes: Array<ScheduledMaintenancePublicNote>,
    scheduledMaintenanceStateTimelines: Array<ScheduledMaintenanceStateTimeline>,
    statusPageResources: Array<StatusPageResource>,
    monitorsInGroup: Dictionary<Array<ObjectID>>,
    isPreviewPage: boolean,
    isSummary: boolean
): EventItemComponentProps => {
    /// get timeline.

    let currentStateStatus: string = '';
    let currentStatusColor: Color = Green;

    const timeline: Array<TimelineItem> = [];

    if (isSummary) {
        // If this is summary then reverse the order so we show the latest first
        scheduledMaintenanceEventsPublicNotes.sort(
            (
                a: ScheduledMaintenancePublicNote,
                b: ScheduledMaintenancePublicNote
            ) => {
                return OneUptimeDate.isAfter(a.createdAt!, b.createdAt!) ===
                    false
                    ? 1
                    : -1;
            }
        );

        scheduledMaintenanceStateTimelines.sort(
            (
                a: ScheduledMaintenanceStateTimeline,
                b: ScheduledMaintenanceStateTimeline
            ) => {
                return OneUptimeDate.isAfter(a.createdAt!, b.createdAt!) ===
                    false
                    ? 1
                    : -1;
            }
        );
    }

    for (const scheduledMaintenancePublicNote of scheduledMaintenanceEventsPublicNotes) {
        if (
            scheduledMaintenancePublicNote.scheduledMaintenanceId?.toString() ===
                scheduledMaintenance.id?.toString() &&
            scheduledMaintenancePublicNote?.note
        ) {
            timeline.push({
                note: scheduledMaintenancePublicNote?.note || '',
                date: scheduledMaintenancePublicNote?.createdAt as Date,
                type: TimelineItemType.Note,
                icon: IconProp.Chat,
                iconColor: Grey,
            });

            if (isSummary) {
                break;
            }
        }
    }

    for (const scheduledMaintenanceEventstateTimeline of scheduledMaintenanceStateTimelines) {
        if (
            scheduledMaintenanceEventstateTimeline.scheduledMaintenanceId?.toString() ===
                scheduledMaintenance.id?.toString() &&
            scheduledMaintenanceEventstateTimeline.scheduledMaintenanceState
        ) {
            timeline.push({
                state: scheduledMaintenanceEventstateTimeline.scheduledMaintenanceState,
                date: scheduledMaintenanceEventstateTimeline
                    .scheduledMaintenanceState?.isScheduledState
                    ? scheduledMaintenance.startsAt!
                    : (scheduledMaintenanceEventstateTimeline?.createdAt as Date),
                type: TimelineItemType.StateChange,
                icon: scheduledMaintenanceEventstateTimeline
                    .scheduledMaintenanceState.isScheduledState
                    ? IconProp.Clock
                    : scheduledMaintenanceEventstateTimeline
                          .scheduledMaintenanceState.isOngoingState
                    ? IconProp.Settings
                    : scheduledMaintenanceEventstateTimeline
                          .scheduledMaintenanceState.isResolvedState
                    ? IconProp.CheckCircle
                    : IconProp.ArrowCircleRight,
                iconColor:
                    scheduledMaintenanceEventstateTimeline
                        .scheduledMaintenanceState.color || Grey,
            });

            if (!currentStateStatus) {
                currentStateStatus =
                    scheduledMaintenanceEventstateTimeline
                        .scheduledMaintenanceState?.name || '';
                currentStatusColor =
                    scheduledMaintenanceEventstateTimeline
                        .scheduledMaintenanceState?.color || Green;
            }

            if (isSummary) {
                break;
            }
        }
    }

    timeline.sort((a: TimelineItem, b: TimelineItem) => {
        return OneUptimeDate.isAfter(a.date, b.date) === true ? 1 : -1;
    });

    let namesOfResources: Array<StatusPageResource> = [];

    if (scheduledMaintenance.monitors) {
        const monitorIdsInThisScheduledMaintenance: Array<string> =
            scheduledMaintenance.monitors
                .map((monitor: Monitor) => {
                    return monitor.id!.toString();
                })
                .filter((id: string) => {
                    return Boolean(id);
                });

        namesOfResources = statusPageResources.filter(
            (resource: StatusPageResource) => {
                return (
                    resource.monitorId &&
                    monitorIdsInThisScheduledMaintenance.includes(
                        resource.monitorId.toString()
                    )
                );
            }
        );

        // add names of the groups as well.
        namesOfResources = namesOfResources.concat(
            statusPageResources.filter((resource: StatusPageResource) => {
                if (!resource.monitorGroupId) {
                    return false;
                }

                const monitorGroupId: string =
                    resource.monitorGroupId.toString();

                const monitorIdsInThisGroup: Array<ObjectID> =
                    monitorsInGroup[monitorGroupId]!;

                for (const monitorId of monitorIdsInThisGroup) {
                    if (
                        monitorIdsInThisScheduledMaintenance.find(
                            (id: string | undefined) => {
                                return id?.toString() === monitorId.toString();
                            }
                        )
                    ) {
                        return true;
                    }
                }

                return false;
            })
        );
    }

    return {
        eventTitle: scheduledMaintenance.title || '',
        eventDescription: scheduledMaintenance.description,
        eventTimeline: timeline,
        eventType: 'Scheduled Maintenance',
        eventResourcesAffected: namesOfResources.map(
            (i: StatusPageResource) => {
                return i.displayName || '';
            }
        ),
        eventViewRoute: !isSummary
            ? undefined
            : RouteUtil.populateRouteParams(
                  isPreviewPage
                      ? (RouteMap[
                            PageMap.PREVIEW_SCHEDULED_EVENT_DETAIL
                        ] as Route)
                      : (RouteMap[PageMap.SCHEDULED_EVENT_DETAIL] as Route),
                  scheduledMaintenance.id!
              ),
        isDetailItem: !isSummary,
        currentStatus: currentStateStatus,
        currentStatusColor: currentStatusColor,
        eventTypeColor: Yellow,
        eventSecondDescription: scheduledMaintenance.startsAt
            ? 'Scheduled at ' +
              OneUptimeDate.getDateAsLocalFormattedString(
                  scheduledMaintenance.startsAt!
              )
            : '',
        labels:
            scheduledMaintenance.labels?.map((label: Label) => {
                return {
                    name: label.name!,
                    color: label.color!,
                };
            }) || [],
    };
};

const Overview: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [
        scheduledMaintenanceEventsPublicNotes,
        setscheduledMaintenanceEventsPublicNotes,
    ] = useState<Array<ScheduledMaintenancePublicNote>>([]);
    const [scheduledMaintenanceEvent, setscheduledMaintenanceEvent] =
        useState<ScheduledMaintenance | null>(null);
    const [
        scheduledMaintenanceStateTimelines,
        setscheduledMaintenanceStateTimelines,
    ] = useState<Array<ScheduledMaintenanceStateTimeline>>([]);
    const [parsedData, setParsedData] =
        useState<EventItemComponentProps | null>(null);

    const [monitorsInGroup, setMonitorsInGroup] = useState<
        Dictionary<Array<ObjectID>>
    >({});

    const [statusPageResources, setStatusPageResources] = useState<
        Array<StatusPageResource>
    >([]);

    StatusPageUtil.checkIfUserHasLoggedIn();

    useAsyncEffect(async () => {
        try {
            if (!StatusPageUtil.getStatusPageId()) {
                return;
            }
            setIsLoading(true);

            const id: ObjectID = LocalStorage.getItem(
                'statusPageId'
            ) as ObjectID;
            if (!id) {
                throw new BadDataException('Status Page ID is required');
            }

            const eventId: string | undefined =
                Navigation.getLastParamAsObjectID().toString();

            const response: HTTPResponse<JSONObject> =
                await API.post<JSONObject>(
                    URL.fromString(STATUS_PAGE_API_URL.toString()).addRoute(
                        `/scheduled-maintenance-events/${id.toString()}/${eventId}`
                    ),
                    {},
                    API.getDefaultHeaders(StatusPageUtil.getStatusPageId()!)
                );

            if (!response.isSuccess()) {
                throw response;
            }
            const data: JSONObject = response.data;

            const scheduledMaintenanceEventsPublicNotes: Array<ScheduledMaintenancePublicNote> =
                BaseModel.fromJSONArray(
                    (data[
                        'scheduledMaintenanceEventsPublicNotes'
                    ] as JSONArray) || [],
                    ScheduledMaintenancePublicNote
                );

            const rawAnnouncements: JSONArray =
                (data['scheduledMaintenanceEvents'] as JSONArray) || [];

            const scheduledMaintenanceEvent: ScheduledMaintenance =
                BaseModel.fromJSONObject(
                    (rawAnnouncements[0] as JSONObject) || {},
                    ScheduledMaintenance
                );
            const scheduledMaintenanceStateTimelines: Array<ScheduledMaintenanceStateTimeline> =
                BaseModel.fromJSONArray(
                    (data['scheduledMaintenanceStateTimelines'] as JSONArray) ||
                        [],
                    ScheduledMaintenanceStateTimeline
                );

            const statusPageResources: Array<StatusPageResource> =
                BaseModel.fromJSONArray(
                    (data['statusPageResources'] as JSONArray) || [],
                    StatusPageResource
                );

            const monitorsInGroup: Dictionary<Array<ObjectID>> =
                JSONFunctions.deserialize(
                    (data['monitorsInGroup'] as JSONObject) || {}
                ) as Dictionary<Array<ObjectID>>;

            // save data. set()
            setscheduledMaintenanceEventsPublicNotes(
                scheduledMaintenanceEventsPublicNotes
            );
            setscheduledMaintenanceEvent(scheduledMaintenanceEvent);
            setStatusPageResources(statusPageResources);

            setscheduledMaintenanceStateTimelines(
                scheduledMaintenanceStateTimelines
            );

            setMonitorsInGroup(monitorsInGroup);

            setIsLoading(false);
            props.onLoadComplete();
        } catch (err) {
            if (err instanceof HTTPErrorResponse) {
                await StatusPageUtil.checkIfTheUserIsAuthenticated(err);
            }
            setError(API.getFriendlyMessage(err));
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoading) {
            // parse data;
            setParsedData(null);
            return;
        }

        if (!scheduledMaintenanceEvent) {
            return;
        }
        setParsedData(
            getScheduledEventEventItem(
                scheduledMaintenanceEvent,
                scheduledMaintenanceEventsPublicNotes,
                scheduledMaintenanceStateTimelines,
                statusPageResources,
                monitorsInGroup,
                Boolean(StatusPageUtil.isPreviewPage())
            )
        );
    }, [isLoading]);

    if (isLoading) {
        return <PageLoader isVisible={true} />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    if (!parsedData) {
        return <PageLoader isVisible={true} />;
    }

    return (
        <Page
            title="Scheduled Event Report"
            breadcrumbLinks={[
                {
                    title: 'Overview',
                    to: RouteUtil.populateRouteParams(
                        StatusPageUtil.isPreviewPage()
                            ? (RouteMap[PageMap.PREVIEW_OVERVIEW] as Route)
                            : (RouteMap[PageMap.OVERVIEW] as Route)
                    ),
                },
                {
                    title: 'Scheduled Events',
                    to: RouteUtil.populateRouteParams(
                        StatusPageUtil.isPreviewPage()
                            ? (RouteMap[
                                  PageMap.PREVIEW_SCHEDULED_EVENT_LIST
                              ] as Route)
                            : (RouteMap[PageMap.SCHEDULED_EVENT_LIST] as Route)
                    ),
                },
                {
                    title: 'Scheduled Event',
                    to: RouteUtil.populateRouteParams(
                        StatusPageUtil.isPreviewPage()
                            ? (RouteMap[
                                  PageMap.PREVIEW_SCHEDULED_EVENT_DETAIL
                              ] as Route)
                            : (RouteMap[
                                  PageMap.SCHEDULED_EVENT_DETAIL
                              ] as Route),
                        Navigation.getLastParamAsObjectID()
                    ),
                },
            ]}
        >
            {scheduledMaintenanceEvent ? <EventItem {...parsedData} /> : <></>}
            {!scheduledMaintenanceEvent ? (
                <EmptyState
                    id="scheduled-event-empty-state"
                    title={'No Scheduled Event'}
                    description={
                        'No scheduled event found for this status page.'
                    }
                    icon={IconProp.Clock}
                />
            ) : (
                <></>
            )}
        </Page>
    );
};

export default Overview;
