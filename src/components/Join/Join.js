import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './Join.css'
const Join = () => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')


  return (
      <div className="joinOuterContainer">
        <div className="joinInnerContainer">
          <h1 className="heading">
            <div>
              <input placeholder="Name"
                     className="joinInput"
                     type="text"
                     onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div>
              <input
                  placeholder="Room"
                  className="joinInput mt-20"
                  type="text"
                  onChange={(event) => setRoom(event.target.value)}
              />
            </div>
            <Link
                onClick={(event) => (!name || !room) ? event.preventDefault() : null}
                to={`/testchat?name=${name}&room=${room}`}>
              <button className='button' type='submit'>Sign In</button>
            </Link>
          </h1>
        </div>
      </div>
  )
}
export default Join