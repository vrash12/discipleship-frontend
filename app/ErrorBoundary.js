// ErrorBoundary.js
import React, { Component } from 'react';
import { View, Text } from 'react-native';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log error messages to an error reporting service here
    this.setState({ hasError: true, error, errorInfo });
    console.error('Error caught by Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View>
          <Text style={{ color: 'red' }}>Something went wrong!</Text>
          <Text>{this.state.error.toString()}</Text>
        </View>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
