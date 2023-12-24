import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, useFilters } from 'react-table';
import ReactPaginate from 'react-paginate';
import './Transactions.css';
import { useNavigate } from 'react-router-dom';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/transactions`, {
          params: {
            page: page + 1,
            limit: 5,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log(res.data);
        if (!Array.isArray(res.data.data)) {
          console.error('res.data.data is not an array:', res.data.data);
          return;
        }
        if (res.data.data.some(transaction => transaction.id === undefined)) {
          console.error('Some transactions do not have an id:', res.data.data);
          return;
        }
        setTransactions(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchTransactions();
  }, [page]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Transaction ID',
        accessor: 'id',
        canFilter: true,
      },
      {
        Header: 'Total',
        accessor: 'value',
        canFilter: true,
      },
      {
        Header: 'Sender',
        accessor: 'sender.name',
        canFilter: true,
      },
      {
        Header: 'Receiver',
        accessor: 'receiver.name',
        canFilter: true,
      },
    ],
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: ({ column: { filterValue, setFilter } }) => (
        <input
          value={filterValue || ''}
          onChange={e => {
            // Set undefined to remove the filter entirely
            setFilter(e.target.value || undefined)
          }}
          placeholder={`Search...`}
        />
      ),
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: transactions, defaultColumn }, useFilters);

  const handlePageClick = ({ selected }) => {
    setPage(selected);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="transactions">
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <table {...getTableProps()} className="transactions-table">
        <thead>
        {headerGroups.map(headerGroup => (
          <>
            <tr {...headerGroup.getHeaderGroupProps()} className="table-header">
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="table-cell">{column.render('Header')}</th>
              ))}
            </tr>
            <tr>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="table-cell">{column.canFilter ? column.render('Filter') : null}</th>
              ))}
            </tr>
          </>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="table-row">
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="table-cell">{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    </div>
  );
}

export default Transactions;