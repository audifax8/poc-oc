import React from 'react';
import { useSelector } from 'react-redux';

import { AttributeHeader } from './components/attribute-header';

import './index.scss';
import { ICAMap, IMenu, IMenuCA, IState } from '../../interfaces';

/**
 * markup based on:
 * https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/
*/
export function Menu() {
  console.log('Menu');
  console.log('@@@@here');
  const loaded = useSelector((state: IState) => state?.core?.loaded);
  const { menuCas } = useSelector((state: IState) => state?.skeleton);
  //const { casToRender } = useSelector((state: IState) => state?.ui);
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
          
          {cas && cas.length &&
            (cas.map((ca: IMenuCA) => {
              console.log({cas, ca});
              //const t = cas[caName] as IMenuCA;
              //console.log({t});
              return <AttributeHeader onClick={() => {}} caInfo={ca}/>
              //return <></>;
            }
            )
          )}
        </ul>
      </nav>
    </section>
  );
}

//{cas && Object.keys(cas).length && }

/*

{!loaded && (
            menuCas.map((ca: ICAMap) => <AttributeHeader onClick={() => {}} caInfo={ca}/>)
          )}

{loaded && casToRender && casToRender.length && (
            casToRender.map((ca: ICAMap) => <AttributeHeader onClick={() => {}} caInfo={ca}/>)
          )}

*/