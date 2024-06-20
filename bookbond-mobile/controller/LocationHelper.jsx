import * as Location from "expo-location";


const getCurrentLocation = async () => {
    try {
        // Request permission to access location
        const result = await Location.requestForegroundPermissionsAsync();
        console.log(`result from permission request : ${result.status}`);

        if (result.status === "granted") {
            console.log(`Location permission granted`);

            // Get current position
            const location = await Location.getCurrentPositionAsync();
            return ({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } else {
            console.log(`Location permission DENIED`);
            throw new Error(`User did not grant location permission`);
        }
    } catch (err) {
        console.log(err);
    }
};

export {
    getCurrentLocation
}