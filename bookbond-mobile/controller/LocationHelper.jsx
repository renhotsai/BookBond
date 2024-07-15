import * as Location from "expo-location";


const getCurrentLocation = async () => {
    try {
        // Request permission to access location
        const result = await Location.requestForegroundPermissionsAsync();

        if (result.status === "granted") {
            // Get current position
            const location = await Location.getCurrentPositionAsync();
            return ({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } else {
            throw new Error(`User did not grant location permission`);
        }
    } catch (err) {
        console.log(err);
    }
};

const reverseGeoCoding = async (coords) => {
    try {
        const result = await Location.reverseGeocodeAsync(coords)

        if (result.length !== 0) {
            //using only first object from result
            const matchedLocation = result[0];
            const address = `${matchedLocation.streetNumber} ${matchedLocation.street}`
            return address;
        } else {
            console.error(`No address found for the given coords`);
            throw null
        }
    } catch (error) {
        console.error(`Unable to perform reverse geocoding : ${error}`);
    }
}

const geocoding = async (address) => {
    try {
        const location = await Location.geocodeAsync(address)
        return {
            latitude: location[0].latitude,
            longitude: location[0].longitude,
        }
    } catch (error) {
        console.error(error);
    }
}


export {
    getCurrentLocation, reverseGeoCoding, geocoding
}