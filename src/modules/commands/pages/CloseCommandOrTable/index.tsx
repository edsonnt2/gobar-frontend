import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';

import { FiEdit, FiChevronDown, FiXCircle } from 'react-icons/fi';
import { Form } from '@unform/web';
import { GiTicket } from 'react-icons/gi';
import { FormHandles } from '@unform/core';
import { IoMdTrash } from 'react-icons/io';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import LayoutBusiness from '~/shared/components/LayoutBusiness';
import { useModal } from '~/shared/hooks/Modal';
import Input from '~/shared/components/Input';
import Button from '~/shared/components/Button';
import api from '~/shared/services/api';
import FormattedUtils from '~/shared/utils/formattedUtils';
import getValidationErrors from '~/shared/utils/getValidationErrors';
import { useToast } from '~/shared/hooks/Toast';

import noAvatar from '~/shared/assets/no-avatar.png';
import noProduct from '~/shared/assets/no-product.png';

import {
  Container,
  RowForm,
  AllCustomers,
  DetailCustomer,
  ImgCustomer,
  InfoCustomer,
  HasTable,
  AllTable,
  InfoTable,
  DetailCustomersTable,
  RowInfoTable,
  ImgCustomerTable,
  H2Description,
  ListProducts,
  RowProducts,
  ImgProduct,
  InfoProduct,
  DescriptionProduct,
  ValueProduct,
  Operator,
  DateProduct,
  IconListProduct,
  TotalCommand,
  TotalProduct,
  BoxButtons,
  SeparatorButton,
} from './styles';

interface ProductData {
  id: string;
  description: string;
  value: number;
  quantity: number;
  created_at: string;
  product?: {
    image_url?: string;
  };
  value_formatted: string;
  value_total_formatted: string;
  image_url?: string;
}

interface CommandOrTableData {
  id: string;
  number: number;
  value_ingress?: number;
  prepaid_ingress?: boolean;
  ingress_consume?: boolean;
  value_consume?: number;
  products: ProductData[];
  customer?: {
    id: string;
    name: string;
    user?: {
      avatar_url?: string;
    };
    avatar_url?: string;
  };
  ingress_formatted?: string;
  value_total: number;
  value_total_formatted: string;
  created_at: string;
  spotlight: boolean;
  table_customer?: {
    id: string;
    customer: {
      id: string;
      name: string;
      user?: {
        avatar_url?: string;
      };
      avatar_url?: string;
    };
  }[];
}

interface CommandData
  extends Omit<CommandOrTableData, 'table_customer' | 'products'> {
  command_product: ProductData[];
}

interface TableData
  extends Omit<
    CommandOrTableData,
    | 'value_ingress'
    | 'prepaid_ingress'
    | 'ingress_consume'
    | 'products'
    | 'customer'
    | 'ingress_formatted'
  > {
  table_product: ProductData[];
}

interface FormData {
  command: string;
  table: string;
}

interface FormSubmitData {
  data: FormData;
  whereSelected: 'command' | 'table';
}

interface HandleChangeSpotlight {
  id: string;
  where: 'command' | 'table';
}

interface HandleRemoveProduct {
  item_product_id: string;
  command_or_table_id: string;
  where: 'command' | 'table';
}

interface HandleRemoveCommandOrTable {
  remove_id: string;
  where: 'command' | 'table';
}

interface HandleRemoveCustomerTable {
  table_id: string;
  customer_id: string;
}

const CloseCommandOrTable: React.FC = () => {
  const { addModal, responseModal, resetResponseModal } = useModal();
  const { addToast } = useToast();
  const formRefCommand = useRef<FormHandles>(null);
  const formRefTable = useRef<FormHandles>(null);
  const [commandProduct, setCommandProduct] = useState<CommandData[]>([]);
  const [tableProduct, setTableProduct] = useState<TableData[]>([]);
  const [idsCommandOrTable, setIdsCommandOrTable] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();

  const handleModalCommand = useCallback(() => {
    addModal({
      list_command: true,
    });
  }, [addModal]);

  const handleModalTable = useCallback(() => {
    addModal({
      list_command: true,
    });
  }, [addModal]);

  const loadingCommand = useCallback(async (number: number) => {
    const response = await api.get<CommandData>('commands/find', {
      params: {
        number,
      },
    });

    const { customer, command_product, ...rest } = response.data;

    let valueTotalCommand = command_product.reduce(
      (prev, { quantity, value }) => {
        const totalValue = Math.fround(quantity * value);

        return totalValue + prev;
      },
      0,
    );

    if (rest.value_ingress) {
      valueTotalCommand = !rest.prepaid_ingress
        ? valueTotalCommand + rest.value_ingress
        : valueTotalCommand;
    }

    setIdsCommandOrTable(prevState => [...prevState, rest.id]);

    setCommandProduct(prevState => [
      ...prevState.map(prev => ({
        ...prev,
        spotlight: false,
      })),
      {
        ...rest,
        ...(rest.value_ingress && {
          ingress_formatted: FormattedUtils.formattedValue(rest.value_ingress),
        }),
        ...(customer && {
          customer: {
            ...customer,
            ...(customer.user?.avatar_url && {
              avatar_url: customer.user.avatar_url,
            }),
          },
        }),
        command_product: command_product.map(({ product, ...restProduct }) => ({
          ...restProduct,
          value_formatted: FormattedUtils.formattedValue(restProduct.value),
          value_total_formatted: FormattedUtils.formattedValue(
            Math.fround(restProduct.quantity * restProduct.value),
          ),
          ...(product?.image_url && {
            image_url: product.image_url,
          }),
        })),
        value_total: valueTotalCommand,
        value_total_formatted: FormattedUtils.formattedValue(valueTotalCommand),
        spotlight: true,
      },
    ]);
  }, []);

  const loadingTable = useCallback(async (number: number) => {
    const response = await api.get<TableData>('tables/find', {
      params: {
        number,
      },
    });

    const { table_customer, table_product, ...rest } = response.data;

    const valueTotalTable = table_product.reduce(
      (prev, { quantity, value }) => {
        const totalValue = Math.fround(quantity * value);

        return totalValue + prev;
      },
      0,
    );

    setIdsCommandOrTable(prevState => [...prevState, rest.id]);

    setTableProduct(prevState => [
      ...prevState.map(prev => ({
        ...prev,
        spotlight: false,
      })),
      {
        ...rest,
        table_product: table_product.map(({ product, ...restProduct }) => ({
          ...restProduct,
          value_formatted: FormattedUtils.formattedValue(restProduct.value),
          value_total_formatted: FormattedUtils.formattedValue(
            Math.fround(restProduct.quantity * restProduct.value),
          ),
          ...(product?.image_url && {
            image_url: product.image_url,
          }),
        })),
        value_total: valueTotalTable,
        value_total_formatted: FormattedUtils.formattedValue(valueTotalTable),
        ...(table_customer && {
          table_customer: table_customer.map(
            ({ customer, ...restCustomer }) => ({
              ...restCustomer,
              customer: {
                ...customer,
                ...(customer.user?.avatar_url && {
                  avatar_url: customer.user.avatar_url,
                }),
              },
            }),
          ),
        }),
        spotlight: true,
      },
    ]);
  }, []);

  const handleSubmit = useCallback(
    async ({ data, whereSelected }: FormSubmitData) => {
      setLoading(true);

      const whereFormRef =
        whereSelected === 'command' ? formRefCommand : formRefTable;

      try {
        formRefCommand.current?.setErrors({});
        formRefTable.current?.setErrors({});

        const schema = Yup.object().shape({
          ...(whereSelected === 'command'
            ? {
                command: Yup.string().required(
                  'Número de Comanda é obrigatório',
                ),
              }
            : {
                table: Yup.string().required('Número da Mesa é obrigatório'),
              }),
        });

        const getSelected =
          whereSelected === 'command' ? data.command : data.table;

        await schema.validate(
          {
            [whereSelected]: getSelected,
          },
          {
            abortEarly: false,
          },
        );

        const formattedNumber = Number(
          getSelected
            .split('')
            .filter(char => Number(char) || char === '0')
            .join(''),
        );

        if (whereSelected === 'command') {
          const showCommand = commandProduct.some(
            ({ number }) => Number(number) === formattedNumber,
          );

          if (showCommand) {
            formRefCommand.current?.setErrors({
              command: 'Comanda já está na lista abaixo',
            });
            return;
          }

          if (tableProduct.length > 0) {
            setTableProduct([]);
            setIdsCommandOrTable([]);
          }

          await loadingCommand(formattedNumber);
        } else {
          const showTable = tableProduct.some(
            ({ number }) => Number(number) === formattedNumber,
          );

          if (showTable) {
            formRefTable.current?.setErrors({
              table: 'Mesa já está na lista abaixo',
            });
            return;
          }

          if (commandProduct.length > 0) {
            setCommandProduct([]);
            setIdsCommandOrTable([]);
          }

          await loadingTable(formattedNumber);
        }

        whereFormRef.current?.setFieldValue(whereSelected, ' ');
        whereFormRef.current?.getFieldRef(whereSelected).focus();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          whereFormRef.current?.setErrors(errors);
        } else {
          const whichError =
            error.response && error.response.data
              ? error.response.data.message
              : 'error';

          if (whichError === 'Command not found at the Business') {
            formRefCommand.current?.setErrors({
              command: 'Comanda não encotrada',
            });
          } else if (whichError === 'Table not found at the Business') {
            formRefTable.current?.setErrors({
              table: 'Mesa não encotrada',
            });
          } else {
            addToast({
              type: 'error',
              message: 'Opss... Encontramos um erro',
              description:
                'Ocorreu um erro ao buscar por comanda, por favor, tente novamente !',
            });
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast, commandProduct, loadingCommand, tableProduct, loadingTable],
  );

  const handleChangeSpotlight = useCallback(
    ({ id, where }: HandleChangeSpotlight) => {
      if (where === 'command') {
        setCommandProduct(prevState =>
          prevState.map(getCommand =>
            getCommand.id === id
              ? {
                  ...getCommand,
                  spotlight: true,
                }
              : {
                  ...getCommand,
                  spotlight: false,
                },
          ),
        );
      } else {
        setTableProduct(prevState =>
          prevState.map(getCommand =>
            getCommand.id === id
              ? {
                  ...getCommand,
                  spotlight: true,
                }
              : {
                  ...getCommand,
                  spotlight: false,
                },
          ),
        );
      }
    },
    [],
  );

  const handleRemoveProduct = useCallback(
    ({ item_product_id, command_or_table_id, where }: HandleRemoveProduct) => {
      let valueTotalProduct = 0;
      api
        .delete(`${where}s/products`, {
          params: {
            [`${where}_product_id`]: item_product_id,
            [`${where}_id`]: command_or_table_id,
          },
        })
        .catch(() => {
          addToast({
            type: 'error',
            message: 'Opss... Encontramos um erro',
            description: `Ocorreu um erro ao deletar o produto da ${
              where === 'command' ? 'Comanda' : 'Mesa'
            }`,
          });
        });
      if (where === 'command') {
        commandProduct.forEach(getCommand => {
          const product = getCommand.command_product.find(
            ({ id }) => id === item_product_id,
          );
          if (product) {
            valueTotalProduct = Math.fround(product.quantity * product.value);
          }
        });

        setCommandProduct(prevState =>
          prevState.map(getCommand =>
            getCommand.id === command_or_table_id
              ? {
                  ...getCommand,
                  command_product: getCommand.command_product.filter(
                    ({ id }) => id !== item_product_id,
                  ),
                  value_total: getCommand.value_total - valueTotalProduct,
                  value_total_formatted: FormattedUtils.formattedValue(
                    getCommand.value_total - valueTotalProduct,
                  ),
                }
              : getCommand,
          ),
        );
      } else {
        tableProduct.forEach(getTable => {
          const product = getTable.table_product.find(
            ({ id }) => id === item_product_id,
          );
          if (product) {
            valueTotalProduct = Math.fround(product.quantity * product.value);
          }
        });

        setTableProduct(prevState =>
          prevState.map(getTable =>
            getTable.id === command_or_table_id
              ? {
                  ...getTable,
                  table_product: getTable.table_product.filter(
                    ({ id }) => id !== item_product_id,
                  ),
                  value_total: getTable.value_total - valueTotalProduct,
                  value_total_formatted: FormattedUtils.formattedValue(
                    getTable.value_total - valueTotalProduct,
                  ),
                }
              : getTable,
          ),
        );
      }

      addToast({
        type: 'success',
        message: `Produto removido da ${
          where === 'command' ? 'Comanda' : 'Mesa'
        } com sucesso`,
      });
    },
    [commandProduct, tableProduct, addToast],
  );

  const spotlightTable = useMemo(
    () => tableProduct.filter(({ spotlight }) => !spotlight),
    [tableProduct],
  );

  const handleRemoveCommandOrTable = useCallback(
    ({ remove_id, where }: HandleRemoveCommandOrTable) => {
      if (where === 'command') {
        setCommandProduct(prevState => {
          const filterCommand = prevState.filter(({ id }) => id !== remove_id);

          if (
            filterCommand.length > 0 &&
            !filterCommand.some(({ spotlight }) => spotlight)
          ) {
            filterCommand[filterCommand.length - 1].spotlight = true;
          }

          return filterCommand;
        });
      }

      if (where === 'table') {
        setTableProduct(prevState => {
          const filterTables = prevState.filter(({ id }) => id !== remove_id);

          if (
            filterTables.length > 0 &&
            !filterTables.some(({ spotlight }) => spotlight)
          ) {
            filterTables[filterTables.length - 1].spotlight = true;
          }

          return filterTables;
        });
      }
    },
    [],
  );

  const handleRemoveCustomerTable = useCallback(
    ({ table_id, customer_id }: HandleRemoveCustomerTable) => {
      api
        .delete(`tables/customers`, {
          params: {
            table_id,
            customer_id,
          },
        })
        .catch(() => {
          addToast({
            type: 'error',
            message: 'Opss... Encontramos um erro',
            description: 'Ocorreu um erro ao deletar o cliente da Mesa',
          });
        });

      setTableProduct(prevState =>
        prevState.map(prev =>
          prev.id === table_id
            ? {
                ...prev,
                table_customer: prev.table_customer?.filter(
                  getCustomer => getCustomer.customer.id !== customer_id,
                ),
              }
            : prev,
        ),
      );

      addToast({
        type: 'success',
        message: 'Cliente removido com sucesso',
      });
    },
    [addToast],
  );

  const spotlightCommandOrTable = useMemo<
    CommandOrTableData | undefined
  >(() => {
    const findCommand = commandProduct.find(({ spotlight }) => spotlight);

    if (findCommand) {
      const { command_product, ...rest } = findCommand;
      return {
        ...rest,
        products: command_product,
      };
    }

    const findTable = tableProduct.find(({ spotlight }) => spotlight);

    if (findTable) {
      const { table_product, ...rest } = findTable;
      return {
        ...rest,
        products: table_product,
      };
    }

    return undefined;
  }, [commandProduct, tableProduct]);

  const valueTotalItems = useMemo(
    () =>
      commandProduct.length > 0
        ? commandProduct.reduce(
            (prev, { value_total }) => value_total + prev,
            0,
          )
        : tableProduct.reduce((prev, { value_total }) => value_total + prev, 0),
    [commandProduct, tableProduct],
  );

  const valueTotalFormatted = useMemo(
    () => FormattedUtils.formattedValue(valueTotalItems),
    [valueTotalItems],
  );

  useEffect(() => {
    formRefCommand.current?.getFieldRef('command').focus();
  }, []);

  useEffect(() => {
    if (state) {
      const { number, command_or_table } = state as {
        number: number;
        command_or_table: 'command' | 'table';
      };

      setLoading(true);
      if (command_or_table === 'command') {
        loadingCommand(number)
          .catch(() => {
            addToast({
              type: 'error',
              message: 'Opss... Encontramos um erro',
              description:
                'Ocorreu um erro ao carregar comanda, por favor, tente novamente !',
            });
          })
          .finally(() => {
            setLoading(false);
          });
        formRefCommand.current?.getFieldRef('command').focus();
      } else {
        loadingTable(number)
          .catch(() => {
            addToast({
              type: 'error',
              message: 'Opss... Encontramos um erro',
              description:
                'Ocorreu um erro ao carregar mesa, por favor, tente novamente !',
            });
          })
          .finally(() => {
            setLoading(false);
          });
        formRefTable.current?.getFieldRef('table').focus();
      }
    } else {
      formRefCommand.current?.getFieldRef('command').focus();
    }
  }, [state, loadingCommand, loadingTable, addToast]);

  useEffect(() => {
    if (responseModal.response) {
      if (responseModal.response === 'discount') {
        // eslint-disable-next-line
        alert('descontar da conta');
        return;
      }

      if (responseModal.response === 'payment') {
        setCommandProduct([]);
        setTableProduct([]);
        setIdsCommandOrTable([]);
      } else {
        formRefCommand.current?.setFieldValue(
          'command',
          responseModal.response,
        );
      }

      formRefCommand.current?.getFieldRef('command').focus();
      resetResponseModal();
    }
  }, [responseModal.response, resetResponseModal]);

  return (
    <LayoutBusiness pgActive="close-command-table">
      <Container>
        <h1>Encontrar Comanda ou Mesa</h1>

        <Form
          onSubmit={e => handleSubmit({ data: e, whereSelected: 'command' })}
          ref={formRefCommand}
        >
          <RowForm>
            <Input
              mask=""
              name="command"
              icon={GiTicket}
              formatField="number"
              placeholder="Número da Camanda"
              isButtonRight={{
                title: 'Encontrar Comanda',
                handleButton: handleModalCommand,
              }}
              style={{ flex: 1 }}
            />
            <Button
              type="submit"
              style={{ width: 170, marginTop: 0, marginLeft: 8 }}
            >
              BUSCAR
            </Button>
          </RowForm>
        </Form>

        <Form
          onSubmit={e => handleSubmit({ data: e, whereSelected: 'table' })}
          ref={formRefTable}
        >
          <RowForm>
            <Input
              mask=""
              name="table"
              icon={GiTicket}
              formatField="number"
              placeholder="Número da Mesa"
              isButtonRight={{
                title: 'Encontrar Mesa',
                handleButton: handleModalTable,
              }}
              style={{ flex: 1 }}
            />
            <Button
              type="submit"
              style={{ width: 170, marginTop: 0, marginLeft: 8 }}
            >
              BUSCAR
            </Button>
          </RowForm>
        </Form>

        {commandProduct.length > 0 && (
          <AllCustomers>
            {commandProduct.map(
              ({ spotlight, id, number, customer, value_total_formatted }) => (
                <DetailCustomer spotlight={spotlight} key={id}>
                  <ImgCustomer spotlight={spotlight}>
                    <img
                      src={customer?.avatar_url || noAvatar}
                      alt={customer?.name}
                    />
                  </ImgCustomer>
                  <InfoCustomer spotlight={spotlight}>
                    <h2>{customer?.name}</h2>
                    <div>
                      <span>
                        Comanda Aberta: <strong>{number}</strong>
                      </span>
                      <span>
                        Valor Total: <strong>{value_total_formatted}</strong>
                      </span>
                    </div>
                  </InfoCustomer>
                  {spotlight ? (
                    <HasTable>
                      Cliente em mesa: <strong>10</strong>
                    </HasTable>
                  ) : (
                    <FiChevronDown
                      size={34}
                      onClick={() => {
                        handleChangeSpotlight({ id, where: 'command' });
                      }}
                    />
                  )}
                  <FiXCircle
                    size={22}
                    style={spotlight ? { marginTop: 30 } : {}}
                    onClick={() => {
                      handleRemoveCommandOrTable({
                        remove_id: id,
                        where: 'command',
                      });
                    }}
                  />
                </DetailCustomer>
              ),
            )}
          </AllCustomers>
        )}

        {tableProduct.length > 0 && (
          <AllTable>
            {spotlightTable.map(
              ({ id, number, value_total_formatted, table_customer }) => (
                <InfoTable key={id}>
                  <h2>Mesa {number}</h2>
                  <span>
                    Valor Total: <strong>{value_total_formatted}</strong>
                  </span>
                  {table_customer && table_customer.length > 0 && (
                    <span>
                      <strong>{table_customer.length}</strong>{' '}
                      {table_customer.length > 1 ? 'Clientes' : 'Cliente'} na
                      Mesa
                    </span>
                  )}
                  <FiChevronDown
                    size={34}
                    style={{ marginTop: -5, marginRight: 16 }}
                    onClick={() => {
                      handleChangeSpotlight({ id, where: 'table' });
                    }}
                  />
                  <FiXCircle
                    size={22}
                    onClick={() => {
                      handleRemoveCommandOrTable({
                        remove_id: id,
                        where: 'table',
                      });
                    }}
                  />
                </InfoTable>
              ),
            )}

            {spotlightCommandOrTable && (
              <>
                <InfoTable spotlight>
                  <h2>Mesa {spotlightCommandOrTable.number} </h2>
                  <span>
                    Valor Total:{' '}
                    <strong>
                      {spotlightCommandOrTable.value_total_formatted}
                    </strong>
                  </span>
                  {spotlightCommandOrTable.table_customer &&
                    spotlightCommandOrTable.table_customer.length > 0 && (
                      <span>
                        <strong>
                          {spotlightCommandOrTable.table_customer.length}
                        </strong>{' '}
                        {spotlightCommandOrTable.table_customer.length > 1
                          ? 'Clientes'
                          : 'Cliente'}{' '}
                        na Mesa
                      </span>
                    )}
                  <FiXCircle
                    size={22}
                    onClick={() => {
                      handleRemoveCommandOrTable({
                        remove_id: spotlightCommandOrTable.id,
                        where: 'table',
                      });
                    }}
                  />
                </InfoTable>

                {spotlightCommandOrTable.table_customer && (
                  <DetailCustomersTable>
                    {spotlightCommandOrTable.table_customer.map(
                      ({ id: keyid, customer: { id, avatar_url, name } }) => (
                        <RowInfoTable key={keyid}>
                          <ImgCustomerTable>
                            <img src={avatar_url || noAvatar} alt={name} />
                          </ImgCustomerTable>

                          <h2>{name}</h2>
                          <Button
                            type="button"
                            style={{ height: 42, fontSize: 16, width: 120 }}
                          >
                            Pagar Parte
                          </Button>
                          <IoMdTrash
                            size={24}
                            onClick={() => {
                              handleRemoveCustomerTable({
                                table_id: spotlightCommandOrTable.id,
                                customer_id: id,
                              });
                            }}
                          />
                        </RowInfoTable>
                      ),
                    )}
                  </DetailCustomersTable>
                )}
              </>
            )}
          </AllTable>
        )}

        {loading && <span>Loading...</span>}

        {!loading && spotlightCommandOrTable ? (
          <>
            <H2Description>
              Descrição da {commandProduct.length > 0 ? 'Comanda' : 'Mesa'}
            </H2Description>

            <ListProducts>
              {spotlightCommandOrTable.products.map(
                ({
                  id,
                  description,
                  image_url,
                  value_formatted,
                  quantity,
                  value_total_formatted,
                  created_at,
                }) => (
                  <RowProducts key={id}>
                    <ImgProduct>
                      <img src={image_url || noProduct} alt={description} />
                    </ImgProduct>
                    <InfoProduct>
                      <h2>{description}</h2>
                      <DescriptionProduct>
                        <ValueProduct>
                          <span>{value_formatted}</span>
                          <span>{quantity}</span>
                          <span>{value_total_formatted}</span>
                        </ValueProduct>
                        <Operator>Operador: 5</Operator>
                      </DescriptionProduct>
                    </InfoProduct>
                    <DateProduct>
                      {format(new Date(created_at), 'dd/MM/yyyy')}
                      <br />
                      {format(new Date(created_at), 'H:mm:ss')}
                    </DateProduct>
                    <IconListProduct>
                      <IoMdTrash
                        size={26}
                        onClick={() => {
                          handleRemoveProduct({
                            item_product_id: id,
                            command_or_table_id: spotlightCommandOrTable.id,
                            where:
                              commandProduct.length > 0 ? 'command' : 'table',
                          });
                        }}
                      />
                    </IconListProduct>
                  </RowProducts>
                ),
              )}
              {spotlightCommandOrTable.value_ingress && (
                <RowProducts>
                  <DescriptionProduct style={{ flex: 1 }}>
                    <ValueProduct>
                      <span>
                        Valor da Entrada:{' '}
                        <strong>
                          {spotlightCommandOrTable.ingress_formatted}
                        </strong>
                      </span>
                    </ValueProduct>
                    <Operator>Operador: 5</Operator>
                  </DescriptionProduct>
                  <DateProduct>
                    {format(
                      new Date(spotlightCommandOrTable.created_at),
                      'dd/MM/yyyy',
                    )}
                    <br />
                    {format(
                      new Date(spotlightCommandOrTable.created_at),
                      'H:mm:ss',
                    )}
                  </DateProduct>
                  <IconListProduct style={{ justifyContent: 'space-between' }}>
                    <IoMdTrash size={26} />
                    <FiEdit size={20} />
                  </IconListProduct>
                </RowProducts>
              )}

              {commandProduct.length > 1 && (
                <RowProducts>
                  <TotalCommand>
                    Valor total da Comanda{' '}
                    {spotlightCommandOrTable.value_total_formatted}
                  </TotalCommand>
                </RowProducts>
              )}

              <RowProducts>
                <TotalProduct>VALOR TOTAL {valueTotalFormatted}</TotalProduct>
              </RowProducts>
            </ListProducts>

            <BoxButtons>
              <Button
                type="button"
                onClick={() => {
                  addModal({
                    make_pay: {
                      value_total: valueTotalItems,
                      type: commandProduct.length > 0 ? 'command' : 'table',
                      close_id: idsCommandOrTable,
                    },
                  });
                }}
              >
                OPÇÃO DE {commandProduct.length > 0 ? 'COMANDA' : 'MESA'}
              </Button>
              <SeparatorButton />
              <Button type="button" style={{ background: '#A6A4A2' }}>
                TRANSFERIR PARA CONTA
              </Button>
            </BoxButtons>
          </>
        ) : (
          <p>
            Informe o número da comanda cadastrada ou o número da mesa ocupada
            para ver as opções de fechamento.
          </p>
        )}
      </Container>
    </LayoutBusiness>
  );
};

export default CloseCommandOrTable;
