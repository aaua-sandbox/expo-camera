import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, CameraRoll } from 'react-native';
import { Camera, Permissions, Icon } from 'expo';
import { Toast, Root } from 'native-base';

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back, // 背面カメラを利用
  };

  constructor(props) {
    super(props);

    this.takePicture = this.takePicture.bind(this);
  }

  // 初回起動時、カメラの使用権限を取得する
  async componentDidMount() {
    let { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  // 撮影
  async takePicture() {
    let pictureData = await this.camera.takePictureAsync();
    console.log(pictureData.uri);
    CameraRoll.saveToCameraRoll(pictureData.uri);

    Toast.show({
      text: 'Success',
      type: 'success',
      position: 'top',
      buration: 2000,
    });
  }

  render() {
    // return (
    //   <View style={styles.container}>
    //     <Text>Open up App.js to start working on your app!HOGE</Text>
    //   </View>
    // );
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <Root>
          <View style={{ flex: 1 }}>
            <Camera
              style={{ flex: 1 }}
              type={this.state.type}
              ref={ ref => { this.camera = ref; } }
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({
                      type: this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                    });
                  }}>
                  <Text
                    style={{ fontSize: 20, marginBottom: 10, color: 'white' }}>
                    {' '}Flip{' '}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.takePicture();
                  }}
                >
                  <Icon.MaterialIcons
                    name="camera"
                    size={70}
                    style={{ marginBottom: 20 }}
                    color="white"
                    />
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
        </Root>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
