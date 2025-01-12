
const datafetchinglink = 'https://www.googleapis.com/youtube/v3/playlistItems'


export async function getServerSideProps(context) {
    const res = await fetch(`${datafetchinglink}?part=snippet&playlistId=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37&key=${process.env.YOUTUBE_API_KEY}`)
    const data = await res.json();
    
    return {
      props: {
        data
      }
    }
  }