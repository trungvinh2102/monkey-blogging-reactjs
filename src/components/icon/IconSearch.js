import React from 'react'

const IconSearch = ({ classname = "", onClick = () => { } }) => {
  return (
    <span className={classname} onClick={onClick}>
      <svg
        width="18"
        height="17"
        viewBox="0 0 18 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="7.66669"
          cy="7.05161"
          rx="6.66669"
          ry="6.05161"
          stroke="#999999"
          strokeWidth="1.5"
        />
        <path
          d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
          stroke="#999999"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
          stroke="#999999"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

export default IconSearch