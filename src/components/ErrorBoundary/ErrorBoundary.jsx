/**
 * ErrorBoundary - catches React errors and displays ErrorScreen
 */

import { Component } from 'react';
import { ErrorScreen } from '@components/ErrorScreen/ErrorScreen.jsx';

export class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// Log error to console in development
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	resetError = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			return (
				<ErrorScreen
					error={this.state.error}
					resetError={this.resetError}
				/>
			);
		}

		return this.props.children;
	}
}
