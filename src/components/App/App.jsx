import { RouterProvider } from '@tanstack/react-router';
import { router } from '@components/Router';
import { DatabaseProvider } from '@lib/context/DatabaseContext';

export const App = () => {
	return (
		<DatabaseProvider>
			<RouterProvider router={router} />
		</DatabaseProvider>
	);
};
