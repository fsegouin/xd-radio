import { useState, useEffect } from 'react'
import Head from 'next/head'

import ReactAudioPlayer from 'react-audio-player'
import SpotifyWebApi from 'spotify-web-api-js'
import useInterval from 'use-interval'

const spotifyApi = new SpotifyWebApi()

const Home = () => {

  const [isOnline, setIsOnline] = useState(false)
  const [artist, setArtist] = useState("")
  const [title, setTitle] = useState("")
  const [albumCover, setAlbumCover] = useState("")

  async function refreshAccessToken() {
    try {
      const response = await fetch('https://spotify.segouin.me/refresh')
      if (response.ok) {
        const json = await response.json()
        spotifyApi.setAccessToken(json.token)
        return true
      } else {
        return false
      }
    } catch (e) {
        return false
    }
  }

  async function refreshSongInfo() {
    try {
      const response = await spotifyApi.getMyCurrentPlayingTrack()
      setArtist(response.item.artists[0].name)
      setTitle(response.item.name)
      setAlbumCover(response.item.album.images[0].url)
    } catch (e) {
      if (e.status === 401) {
        const result = await refreshAccessToken()
        if (result) {
          refreshSongInfo()
        }
      }
    }
  }

  useEffect(() => {
    refreshSongInfo()
  }, [])

  useInterval(() => {
    refreshSongInfo()
  }, 30000)

  return (
    <div className="container">
      <Head>
        <title>xD Radio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="description">
        {/*
          <svg className="logo" width="429px" height="368px" viewBox="0 0 429 368" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="Artboard" transform="translate(-101.000000, -124.000000)" fill="#000000">
                <g id="Group" transform="translate(100.000000, 124.000000)">
                  <text id="RADIO" fontFamily="ARRIVALApercuPro-Bold, ARRIVAL Apercu Pro" fontSize="138" fontWeight="bold" letterSpacing="5.11111111">
                    <tspan x="2.29222222" y="366">RADIO</tspan>
                  </text>
                  <text id="XD" fontFamily="ARRIVALApercuPro-Regular, ARRIVAL Apercu Pro" fontSize="154" fontWeight="normal" letterSpacing="5.7037037">
                    <tspan x="244" y="158">XD</tspan>
                  </text>
                  <g id="asterisk" transform="translate(1.000000, 0.000000)">
                    <polygon id="Path" points="80.0957727 0 80.0957727 78.458383 11.4042273 39.2291915 0 58.7708085 68.6873864 98 0 137.229191 11.4042273 156.770809 80.0957727 117.541617 80.0957727 196 102.908386 196 102.908386 117.541617 171.595773 156.770809 183 137.229191 114.312614 98 183 58.7708085 171.595773 39.2291915 102.908386 78.458383 102.908386 0"></polygon>
                  </g>
                </g>
              </g>
            </g>
          </svg>
          */}
          <div style={{ width: '300px', maxWidth: '66vw', margin: '0 auto' }}><img width="100%" src="/logo.png" /></div>
          <div className="isonline">{isOnline ? <span style={{ color: '#4CAF50'}}>Online</span> : <span style={{ color: '#F44336' }}>Offline</span>}</div>
          {isOnline && (
            <div className="nowplaying">
              <div style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Now playing:</div>
              <div style={{ width: '120px', marginTop: '0.33rem' }}><img width="100%" src={albumCover} /></div>
              <div>{title}</div>
              <div style={{ opacity: '0.6' }}>{artist}</div>
            </div>
          )}
          <ReactAudioPlayer
            autoPlay
            controls
            onCanPlay={() => setIsOnline(true)}
            src="https://radio.segouin.me/stream"
          />
        </div>
      </main>

      <footer>
        <a
          href="https://arrival.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by
          <div style={{ width: '20px', marginLeft: '0.33em' }}>
            <svg style={{ width: '100%', height: '100%' }} width="50px" height="54px" viewBox="0 0 50 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <g id="Page-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="asterisk" fill="#000000">
                  <polygon id="Path" points="21.8840909 0 21.8840909 21.4367167 3.11590909 10.7183583 0 16.057598 18.7670455 26.7759563 0 37.4943146 3.11590909 42.8335542 21.8840909 32.1151959 21.8840909 53.5519126 28.1170455 53.5519126 28.1170455 32.1151959 46.8840909 42.8335542 50 37.4943146 31.2329545 26.7759563 50 16.057598 46.8840909 10.7183583 28.1170455 21.4367167 28.1170455 0"></polygon>
                </g>
              </g>
            </svg>
          </div>
        </a>
      </footer>

      <style jsx>{/* CSS */`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        .description .isonline {
          text-transform: uppercase;
          font-weight: bold;
          margin: 2rem 0;
        }

        .nowplaying {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin-bottom: 2rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Lato:400,700&display=swap');

        html,
        body {
          padding: 0;
          margin: 0;
          font-family: 'Lato', -apple-system, sans-serif; 
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export default Home
