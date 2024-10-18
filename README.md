
# LoFi Music App 🎶

**LoFi Music App** is a modern web application designed to stream lo-fi music, offering a sleek and simple interface for discovering and playing music.

## Features 🚀

- **Search and Discovery**: Easily find music tracks or playlists.
- **Responsive Design**: Accessible across all devices (mobile, tablet, and desktop).
- **User Authentication**: Secure login system with token-based session management.
- **Music Control**: Full playback controls, including play, pause, skip, forward, and rewind.
- **Playlist Creation**: Users can create and manage custom playlists.
- **Collaborative Playlists**: Create and share playlists with friends.
- **Top Charts**: Explore the most popular global tracks.
- **Trending Around You**: Explore the most popular tracks trending in your country.

## Tech Stack 🛠

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Caching**: Redis for session management and caching search results
- **Music API**: Integration with a music API for streaming and discovery
- **Lyrics API**: Integration with a lyrics API for live lyrics fetching
- **Authentication**: Session-based authentication using tokens stored in Redis
- **Deployment**: Docker for containerization

## Installation 🔧

1. Clone the repository:
   ```bash
   git clone https://github.com/Mohamed-Aladdin/lofi-music-app.git
   ```

2. Install dependencies:
   ```bash
   cd lofi-music-app
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Define your MongoDB URI, Redis URL, and other necessary keys for authentication and the music API.

4. Run the application:
   ```bash
   npm start
   ```

## Usage 📖

Once the app is running, you can:
- Search for your favorite tracks.
- Add songs to your playlists.
- Join the live chat to discuss music with other users.
- Explore trending tracks on the Top Charts.

## Contributing 🤝

Contributions are welcome! If you'd like to contribute:
1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
