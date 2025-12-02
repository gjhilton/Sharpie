import { RouterProvider } from '@tanstack/react-router';
import { router } from '@components/Router';
import { DatabaseProvider } from '@lib/context/DatabaseContext.jsx';

const App = () => {
	return (
		<DatabaseProvider>
			<RouterProvider router={router} />
		</DatabaseProvider>
	);
};

export { App };
export default App;
