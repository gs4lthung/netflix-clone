import { fetchFromTMDB } from "../services/tmdb.service.js";
import { User } from "../models/user.model.js";
export async function searchPerson(req, res) {
  const { query } = req.params;
  try {
    const res = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );
    if (res.results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No results found" });
    }
   await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: res.results[0].id,
          image: res.results[0].profile_path,
          title: res.results[0].name,
          searchType: "person",
          createdAt: Date.now(),
        },
      },
    });
    res.status(200).json({ success: true, content: res.results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
export async function searchMovie(req, res) {
  const { query } = req.params;
  try {
    await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    ).then((res) => {
      if (res.results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No results found" });
      }
      User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: res.results[0].id,
            image: res.results[0].poster_path,
            title: res.results[0].title,
            searchType: "movie",
            createdAt: Date.now(),
          },
        },
      });
      res.status(200).json({ success: true, content: res.results });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
export async function searchTv(req, res) {
  const { query } = req.params;
  try {
    await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    ).then((res) => {
      if (res.results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No results found" });
      }
      User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: res.results[0].id,
            image: res.results[0].poster_path,
            title: res.results[0].name,
            searchType: "tv ",
            createdAt: Date.now(),
          },
        },
      });
      res.status(200).json({ success: true, content: res.results });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function searchHistory(req, res) {
  try {
    res.status(200).json({ success: true, content: req.user.searchHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function deleteItemFromSearchHistory(req, res) {
  const { id } = req.params;
  id = parseInt(id);
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { searchHistory: { id: id } },
    });
    res
      .status(200)
      .json({ success: true, content: "Item removed from search history" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
