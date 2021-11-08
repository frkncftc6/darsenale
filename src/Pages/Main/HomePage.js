import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import WebView from "react-native-webview";

const HomePage = () => {
    return (
        <SafeAreaProvider>
            <StatusBar style='dark'/>
            <WebView
            source={{
            uri: 'https://www.darsenale.com/'
            }}
            />
        </SafeAreaProvider>
        
    );
}

export default HomePage;
