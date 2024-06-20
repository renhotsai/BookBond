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

export {
    getCurrentLocation
}