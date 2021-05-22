import { Fragment, useMemo } from 'react';
import { useTransition } from 'react-spring';

import { ModalRequest, useModal } from '@/hooks';

import { BackDrop } from '@/components';

import TableForCustomer from './TableForCustomer';
import ListTables from './ListTables';
import ListCommands from './ListCommands';
import Command from './Command';
import MakePay from './MakePay';

const Modals: React.FC<{ data?: ModalRequest }> = ({ data }) => {
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
          {item.list_commands && <ListCommands style={props} />}
          {item.list_tables && <ListTables style={props} place={item.list_tables} />}

          {item.make_pay && <MakePay style={props} data={item.make_pay} />}
        </Fragment>
      ))}
    </>
  );
};

export { Modals };
