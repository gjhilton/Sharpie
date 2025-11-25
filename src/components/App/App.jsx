import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/router.jsx';
import { DatabaseProvider } from '@context/DatabaseContext.jsx';

const App = () => {
	return (
		<DatabaseProvider>
			<RouterProvider router={router} />
		</DatabaseProvider>
	);
};

export { App };
export default App;
