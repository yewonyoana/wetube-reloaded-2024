// configure app
// req, res: send request to browser -> must return a response
// next: moving onto the next function, every middleware must have it
// exporting each and every function
export const trending = (req, res) => res.send("Trending");
export const see = (req, res) => res.send("Watch");
export const edit = (req, res) => res.send("Edit");
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => res.send("Delete Video");
