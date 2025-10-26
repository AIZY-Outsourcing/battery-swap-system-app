import { useState, useEffect } from "react";
import { useCameraPermissions } from "expo-camera";

export const useCamera = (screenName?: string) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);

  useEffect(() => {
    if (permission?.granted) {
      setIsCameraAvailable(true);
    } else {
      setIsCameraAvailable(false);
    }
  }, [permission]);

  return {
    permission: permission === null ? null : permission?.granted,
    requestPermission,
    isCameraAvailable,
  };
};

