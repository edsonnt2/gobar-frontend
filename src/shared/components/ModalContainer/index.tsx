import React, { Fragment, useMemo } from 'react';
import { useTransition } from 'react-spring';

import { ModalRequest, useModal } from '../../hooks/Modal';

import BackDrop from '../BackDrop';
import Command from './Command';
import TableForCustomer from './TableForCustomer';
import ListCommand from './ListCommand';
import MakePay from './MakePay';

interface Props {
  data?: ModalRequest;
}

const ModalContainer: React.FC<Props> = ({ data }) => {
  const { removeModal } = useModal();

  const newData = useMemo(() => {
    if (data) return [data];
    return [];
  }, [data]);

  const transitions = useTransition(newData, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <>
      {transitions.map(({ item, key, props }) => (
        <Fragment key={key}>
          <BackDrop show style={props} clicked={removeModal} />
          {item.customer &&
            (item.customer.command_or_table === 'command' ? (
              <Command style={props} data={item.customer} />
            ) : (
              <TableForCustomer style={props} data={item.customer} />
            ))}
          {item.list_command && <ListCommand style={props} />}
          {item.make_pay && <MakePay style={props} data={item.make_pay} />}
        </Fragment>
      ))}
    </>
  );
};

export default ModalContainer;
