import React from 'react';
import { useSelector } from 'react-redux';

import Button from '../button';
import './index.scss';
import { IState } from '../../interfaces';
import { useVM } from '../../providers/vm';

export function Header() {
  const name = useSelector((state: IState) => state?.product?.name);
  const darkMode = useSelector((state: IState) => state?.ui?.darkMode);

  const { enabled, failed, loading } = useSelector((state: IState) => state?.vm);
  const { vmService } = useVM();

  const onVMlick = async () => {
    if (enabled) {
      const isSupported = await vmService.isBrowserSupported();
      console.log({ isSupported });
    }
  };

  return (
    <section className='fc-header'>
      <div className={`fc-header--name ${darkMode ? 'fc-dark-mode' : ''}`}>
        {name && <span className=''>{name}</span>}
        {!name && <div className='fc-skeleton-text fc-skeleton'></div>}
      </div>
      {enabled &&
        <div className='fc-header--vm'>
          <Button
            label='try on'
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M16.875 4.5H13.6553L11.8901 2.73488C11.82 2.66438 11.7244 2.625 11.625 2.625H6.375C6.27563 2.625 6.18 2.66438 6.10987 2.73488L4.34475 4.5H1.125C0.50475 4.5 0 5.00475 0 5.625V13.875C0 14.4952 0.50475 15 1.125 15H16.875C17.4953 15 18 14.4952 18 13.875V5.625C18 5.00475 17.4953 4.5 16.875 4.5ZM17.25 13.875C17.25 14.082 17.0816 14.25 16.875 14.25H1.125C0.918375 14.25 0.75 14.082 0.75 13.875V5.625C0.75 5.418 0.918375 5.25 1.125 5.25H4.5C4.596 5.25 4.692 5.21325 4.76512 5.14012L6.53025 3.375H11.4698L13.2349 5.14012C13.308 5.21325 13.404 5.25 13.5 5.25H16.875C17.0816 5.25 17.25 5.418 17.25 5.625V13.875Z" fill="white"/>
                <path d="M9 6C7.13925 6 5.625 7.51388 5.625 9.375C5.625 11.2361 7.13925 12.75 9 12.75C10.8608 12.75 12.375 11.2361 12.375 9.375C12.375 7.51388 10.8608 6 9 6ZM9 12C7.5525 12 6.375 10.8221 6.375 9.375C6.375 7.92788 7.5525 6.75 9 6.75C10.4475 6.75 11.625 7.92788 11.625 9.375C11.625 10.8221 10.4475 12 9 12Z" fill="white"/>
              </svg>
            }
            enabled={(!failed && enabled)}
            onClickCallback={onVMlick}
            skeleton={loading}
          />
        </div>
      }
    </section>
  );
};
