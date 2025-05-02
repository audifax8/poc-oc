import React from 'react';
import { useSelector } from 'react-redux';

import { AttributeHeader } from './components/attribute-header';

import './index.scss';
import { ICAMap, IState } from '../../interfaces';

export function Menu() {
  const loaded = useSelector((state: IState) => state?.core?.loaded);
  const { menuCas } = useSelector((state: IState) => state?.skeleton);
  const { casToRender } = useSelector((state: IState) => state?.ui);
  
  return (
    <section
      className={`fc-menu ${!loaded ? '' : ''}`}
    >
      <nav aria-label='configurable attributes menu' id='accordionGroup'>
        <ul className='menubar-navigation' aria-label='configurable attributes menu'>
          {!loaded && (
            menuCas.map((ca: ICAMap) => <AttributeHeader onClick={() => {}} caInfo={ca}/>)
          )}
          {loaded && casToRender && casToRender.length && (
            casToRender.map((ca: ICAMap) => <AttributeHeader onClick={() => {}} caInfo={ca}/>)
          )}
        </ul>
      </nav>
    </section>
  );
}
