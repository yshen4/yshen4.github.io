console.log('Callback start');

const loginUser = (user, pwd, callback) => {
  setTimeout( () => callback( {name: user, email: `${user}@yahoo.com`} ), 
    1000);
};

const getFavoriteVideos = (loggedUser, callback) => {
  setTimeout( () => callback( {user: loggedUser, favorites: ['video1', 'video2', 'video3']} ),
    2000);
};

loginUser('yshen4', '12345', 
  (loggedUser) => getFavoriteVideos(loggedUser, 
    (mappedVideos) => console.table(mappedVideos)
  )
);

console.log('Callback end');
