export default () => {
    return (ctr: Function) => {
        ctr.prototype.canOwnerReadListRecord = true;
    };
};
