import React from 'react';
import {Image} from 'react-native';
import ScanbotSDK, {Page} from 'react-native-scanbot-sdk/src';

type PreviewImageProps = {
  page: Page;
  style: any;
};

// These values depend on how the Scanbot SDK was initialized
const IMAGE_FILE_FORMAT = 'JPG';
const FILE_ENCRYPTION_ENABLED = false;

export default function PreviewImage(props: PreviewImageProps) {
  const [uri, setUri] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const loadDecryptedImageData = async () => {
      const result = await ScanbotSDK.getImageData(
        props.page.documentPreviewImageFileUri!,
      );
      const imgMimeType =
        IMAGE_FILE_FORMAT === 'JPG' ? 'image/jpeg' : 'image/png';
      setUri(`data:${imgMimeType};base64,${result.base64ImageData}`);
    };

    if (FILE_ENCRYPTION_ENABLED) {
      // File encryption is enabled, so we need to load the decrypted image data
      // as base64 from SDK. The SDK decrypts the image data under the hood.
      loadDecryptedImageData();
    } else {
      setUri(props.page.documentPreviewImageFileUri!);
    }
  }, [props.page]);

  return <Image source={{uri: uri}} style={props.style} />;
}