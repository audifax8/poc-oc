import React from 'react';
import { useSelector } from 'react-redux';

import { AttributeHeader } from './components/attribute-header';

import './index.scss';
import { ICAMap, IMenuCA, IState } from '../../interfaces';

/**
 * markup based on:
 * https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/
*/
export function Menu() {
  const { loaded } = useSelector((state: IState) => state?.core);
  const { menuCas } = useSelector((state: IState) => state?.skeleton);
  const { cas } = useSelector((state: IState) => state?.menu);
  
  return (
    <section
      className='fc-menu'
    >
      <nav
        id='accordionGroup'
        aria-label='configurable attributes menu'
        className='fc-accordion'
      >
        <ul
          className='fc-accordion-list'
          aria-label='configurable attributes menu'
        >
          {!loaded && menuCas && menuCas.length && 
            menuCas.map((ca: ICAMap, index: number) => 
              (<li key={ca.id || index}>
                <AttributeHeader  caAlias={ca.alias} skeleton={true} mockCA={ca} />
              </li>)
          )}
          {loaded && cas && cas.length &&
            cas.map((ca: IMenuCA, index: number) =>
              (<li key={ca.id || index}>
                <AttributeHeader caAlias={ca.alias} />
              </li>)
          )}
        </ul>
      </nav>
    </section>
  );
};
