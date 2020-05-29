console.log('Async start');

//new Promise(resolve[, reject]);
const loginUser = (user, pwd) => new Promise((resolve, reject) => {
  //if (user !== 'yshen4') reject( new Error(`${user} is not logged in`) );
  setTimeout( () => resolve( {name: user, email: `${user}@yahoo.com`} ), 
    1000);
});

const getFavoriteVideos = (loggedUser) => new Promise((resolve, reject) => {
  if (loggedUser.name !== 'yshen4') reject( new Error(`${loggedUser.name} has no favorites`) );
  setTimeout( () => resolve( {user: loggedUser, favorites: ['video1', 'video2', 'video3']} ),
    2000);
});

async function queryFavorites(user, pwd) {
  try {
    const loggedUser = await loginUser(user, pwd);
    const mappedVideos = await getFavoriteVideos(loggedUser);
    console.table(mappedVideos);
  }
  catch (err) {
    console.log(err.message);
  }
}

queryFavorites('yshen4', '12345');
queryFavorites('yshen5', '12345');

console.log('Async end');
