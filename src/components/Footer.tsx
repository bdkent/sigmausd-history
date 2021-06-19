import React, { memo } from 'react';

export const Footer = memo(() => {
  const addr =
    document.querySelector<HTMLMetaElement>('meta[name=tip]')?.content;
  const tipAddress = addr?.includes('REACT_APP_TIP') ? undefined : addr;

  return (
    <footer className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              href="http://sigmausd.io"
              className="nav-link"
              target="_blank"
              rel="noreferrer"
            >
              sigmausd.io
            </a>
          </li>
        </ul>
        {tipAddress && (
          <a
            href={`https://explorer.ergoplatform.com/en/addresses/${tipAddress}`}
            target="_blank"
            rel="noreferrer"
          >
            &hearts; donations
          </a>
        )}
      </div>
    </footer>
  );
});
