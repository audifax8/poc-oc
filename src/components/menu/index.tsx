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
  const loaded = useSelector((state: IState) => state?.core?.loaded);
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
          {!loaded && menuCas && menuCas.length && (
            menuCas.map((ca: ICAMap) => <AttributeHeader  caAlias={ca.alias} skeleton={true} />)
          )}
          {loaded && cas && cas.length &&
            cas.map((ca: IMenuCA) => <AttributeHeader caAlias={ca.alias} />)
          }
        </ul>
      </nav>
    </section>
  );
}
