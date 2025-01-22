import User from "../models/User.js";

export const swipeRight = async (req, res) => {
  try {
    const { likedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);
    const likedUser = await User.findById(likedUserId);

    if (!likedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      await currentUser.save();
    }
    if (!currentUser.likes.includes(currentUser.id)) {
      currentUser.matches.push(likedUserId);
      likedUser.matches.push(currentUser.id);

      await Promise.all([await currentUser.save(), await likedUser.save()]);
    }
    res.status(200).json({success: true, user: currentUser, message: "User liked successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
    console.log("error in the swipe right controller", error);
  }
};

export const swipeLeft = async (req, res) => {
  try {
    const { dislikedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);

    if (!currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes.push(dislikedUserId);
      await currentUser.save();
    }

    res.status(200).json({
      success: true,
      user: currentUser,
      message: "User disliked successfully",
    });
  } catch (error) {
    console.log("error in the swipe left controller", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "matches",
      "name image"
    );
    res.status(200).json({ success: true, matches: user.matches });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
    console.log("error in the get matches controller", error);
  }
};
export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = await User.find({
      $and: [
        { _id: { $ne: currentUser.id } },
        { _id: { $nin: currentUser.likes } },
        { _id: { $nin: currentUser.dislikes } },
        { _id: { $nin: currentUser.matches } },
        {
          gender:
            currentUser.genderPreference === "both"
              ? { $in: ["male", "female"] }
              : currentUser.genderPreference,
        },
        { genderPreference: { $in: [currentUser.gender, "both"] } },
      ],
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
    console.log("error in the get user profiles controller", error);
  }
};
