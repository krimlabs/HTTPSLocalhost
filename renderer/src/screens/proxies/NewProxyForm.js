import React from 'react';
import createStore from 'pure-store';
import {withStores} from 'lib/react-pure-state';

import proxiesStore, {createProxy} from 'domain/proxies';
import Button from 'components/ui/Button';
import lockIcon from 'assets/img/lock.svg';
import infoIcon from 'assets/img/info.svg';
import colors from 'utils/colors';
import commsUp from 'assets/img/comms-up.png';
import commsDown from 'assets/img/comms-down.png';
import InputRow from 'screens/proxies/newProxyForm/InputRow';

const store = createStore({
  from: '',
  to: ''
});

const NewProxyForm = () => {
  const {from, to} = store.state;
  const {creatingProxy, errors} = proxiesStore.state;
  return (<div className="" style={{}}>
    
    <div className="b black-60 tc pv2 mb1">
      Add new proxy
    </div>
    <div className="w-80 center">
      <form onSubmit={(e) => {
        e.preventDefault();
        createProxy(from, to);
      }}>
        <InputRow
          icon={lockIcon}
          label={<React.Fragment>
            <span style={{color: colors.secureGreen}}>https:</span>
            <span className="gray">//</span>
          </React.Fragment>}
          placeholder="athena.local"
          value={from}
          onChange={(e) => store.update({from: e.target.value})}
          error={errors.from}
        />
        <div className="cf">
          <div className="fl w-50 tr relative" style={{zIndex: 0, marginTop: -16}}>
            <img src={commsDown} alt=""/>
          </div>
          <div className="fl w-50 pl5">
            <img src={commsUp} alt="" className="pt1" style={{zIndex: 0, marginBottom: -24}}/>
          </div>
        </div>
        <InputRow
          icon={infoIcon}
          label={<span className="gray">http://</span>}
          placeholder="localhost:8000"
          value={to}
          onChange={(e) => store.update({to: e.target.value})}
          error={errors.to}
        />
        <div className="tr">
          <Button
            className="mt2 mr2"
            text="Save"
            height={28}
            type="submit"
            loading={creatingProxy}
          />
        </div>
      </form>
    </div>
  </div>);
};

export default withStores([store, proxiesStore], NewProxyForm);
