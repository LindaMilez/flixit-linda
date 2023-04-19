import MovieCardsList from "../../common/MovieCardsList";
import Navbar from "../../common/Navbar";
import useLogin from "../../hooks/useLogin";
import './home.css';

export const getTitle = (filter) => {
  switch (filter) {
    case 'popular':
      return "Popular";
    case 'upcoming':
      return "Upcoming";
    case 'watchlist':
      return "Watch list";
    case 'favourites':
      return "Favourites";
    case 'search':
      return "Search results";
    default: return "All Movies";
  }
}

const Home = ({ filter = "all" }) => {
  const loginUser = useLogin();
  const title = getTitle(filter);

  return (
    <div className="container-fluid">
      <div className="row">
        <Navbar filter={filter} />
        <main className={`col-md-9 ${loginUser ? 'ms-sm-auto' : 'mx-sm-auto'}  col-lg-10 px-md-4`}>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">{ title }</h1>
          </div>
          <MovieCardsList filter={filter} />
        </main>
      </div>
    </div>
  );
};

export default Home;
