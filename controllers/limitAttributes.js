export default (data, attributes) => {
    const retData = {};
    attributes.forEach((attribute) => {
        if (attribute in data) {
            retData[attribute] = data[attribute];
        }
    });
    return retData;
}