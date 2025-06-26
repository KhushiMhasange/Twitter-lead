import { useRoutes, Link, usePath } from "raviger";
import './App.css';
import PostFetcher from './components/PostFetcher';
import RecentPosts from './components/RecentPosts';

function App() {
  const routes = useRoutes({
    "/": () => <PostFetcher />,
    "/liked-tweets": () => <RecentPosts />,
  });

  const currentPath = usePath();

  return (
    <div className="App bg-zinc-950 min-h-screen">
      <nav className="bg-zinc-800 p-4 shadow-lg border-b-2 border-zinc-950">
        <ul className="flex justify-center space-x-8">
          <li>
            <Link
              href="/"
              className={`text-lg font-medium transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-zinc-700 ${
                currentPath === "/" ? "text-teal-400" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Fetch Leads
            </Link>
          </li>
          <li>
            <Link
              href="/liked-tweets"
              className={`text-lg font-medium transition duration-300 ease-in-out px-4 py-2 rounded-md hover:bg-zinc-700 ${
                currentPath === "/liked-tweets" ? "text-teal-400" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Recent Tweets
            </Link>
          </li>
        </ul>
      </nav>

      <main>{routes}</main>
      <footer className="bg-zinc-800"><p className="text-white">Made  by  @KhushiMhasange</p></footer>
    </div>
  );
}

export default App;
