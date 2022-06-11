import BarLoader from "react-spinners/BarLoader";
import React, { FunctionComponent } from 'react';
import Color from 'Common/Types/Color';

export enum LoaderType {
    Bar
}

export interface ComponentProps { 
    size?: number, 
    color?: Color,
    loaderType?: LoaderType
}

const Loader: FunctionComponent<ComponentProps> = ({
    size = 50, 
    color = new Color("#000000"),
    loaderType = LoaderType.Bar
}: ComponentProps) => {

    if (loaderType === LoaderType.Bar) {
        return (
            <BarLoader height={4} width={size} color={color.toString()} />
        );
    }

    return <></>
}

export default Loader;