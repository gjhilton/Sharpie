import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/router.jsx';

const App = () => {
	return <RouterProvider router={router} />;
};

export { App };
export default App;
