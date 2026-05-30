import { useEffect, useState } from 'react';
import '../../css/finance/finance.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { createPortal } from 'react-dom';

function FinanceView() {
  const [txs, setTxs] = useState([]);
  const [summary, setSummary] = useState({ incomes: 0, expenses: 0, balance: 0 });
  const todayIso = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ kind: 'income', amount: '', date: todayIso, category: '', notes: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('income');
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    fetchAll();
    fetchSummary();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/finances');
      if (res.ok) {
        const data = await res.json();
        setTxs(data.reverse());
      }
    } catch (e) { console.error(e); }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/finances/summary');
      if (res.ok) setSummary(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, amount: parseFloat(form.amount) };
    try {
      const res = await fetch('http://localhost:5000/api/finances/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (res.ok) {
        setForm({ kind: 'income', amount: '', date: '', category: '', notes: '' });
        fetchAll();
        fetchSummary();
      }
    } catch (err) { console.error(err); }
  };

  // Prepare simple charts
  const lineData = txs.slice().reverse().map(t => ({ date: t.date.split('T')[0], amount: t.kind === 'income' ? t.amount : -t.amount }));

  const byCategory = Object.values(txs.reduce((acc, t) => {
    const k = t.category || 'Sin categoría';
    acc[k] = acc[k] || { name: k, value: 0 };
    acc[k].value += (t.kind === 'income' ? t.amount : Math.abs(t.amount));
    return acc;
  }, {}));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6B6B'];

  return (
    <div className="finance-view">
      <div className="finance-header">
        <div className="balance-box">
          <div>Balance</div>
          <div className="balance-amount">{summary.balance.toFixed(2)} €</div>
          <div className="sub">Ingresos: {summary.incomes.toFixed(2)} € — Gastos: {summary.expenses.toFixed(2)} €</div>
        </div>
        <div className="finance-actions">
          <button className="btn-action" onClick={() => { setModalType('income'); setShowModal(true); }}>Ingreso</button>
          <button className="btn-action" onClick={() => { setModalType('expense'); setShowModal(true); }}>Gasto</button>
          <button className="btn-action" onClick={() => { setModalType('debt'); setShowModal(true); }}>Deuda</button>
          <button className="btn-action danger" onClick={() => setShowClearConfirm(true)}>Borrar datos</button>
        </div>
      </div>

      <div className="finance-charts">
        <div className="chart card">
          <h4>Saldo (últimas transacciones)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#00C49F" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart card">
          <h4>Gasto por categoría</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="debts card">
        <h4>Deudas (antiguas primero)</h4>
        <table>
          <thead>
            <tr><th>Fecha</th><th>Categoría</th><th>Importe</th><th>Notas</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {txs
              .filter(t => t.kind === 'debt')
              .slice()
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(d => (
                <tr key={d.id}>
                  <td>{d.date.split('T')[0]}</td>
                  <td>{d.category || 'Sin categoría'}</td>
                  <td style={{ color: '#ffd166' }}>{d.amount.toFixed(2)}</td>
                  <td>{d.notes}</td>
                  <td>
                    <button className="btn-action" onClick={() => { setSelectedDebt(d); setPayAmount(d.amount.toString()); setShowPayModal(true); }}>Pagar</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="transactions card">
        <h4>Transacciones</h4>
        <table>
          <thead>
            <tr><th>Fecha</th><th>Tipo</th><th>Categoría</th><th>Importe</th><th>Notas</th></tr>
          </thead>
          <tbody>
            {txs.map(tx => (
              <tr key={tx.id}>
                <td>{tx.date.split('T')[0]}</td>
                <td>{tx.kind}</td>
                <td>{tx.category}</td>
                <td style={{ color: tx.kind === 'expense' ? '#ff6b6b' : '#9ef4b8' }}>{tx.amount.toFixed(2)}</td>
                <td>{tx.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPayModal && selectedDebt && createPortal(
        <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Pagar deuda: {selectedDebt.category || 'Deuda'} — {selectedDebt.amount.toFixed(2)} €</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const amt = parseFloat(payAmount);
              if (!amt || amt <= 0) return;
              try {
                // Crear transacción de pago como gasto
                const payPayload = { kind: 'expense', amount: amt, date: new Date().toISOString(), category: 'Pago deuda', notes: `Pago a deuda #${selectedDebt.id}` };
                const res = await fetch(`http://localhost:5000/api/finances/create`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payPayload) });
                if (!res.ok) throw new Error('Error creando pago');

                // Si pagó completamente, eliminar la deuda; si es parcial, actualizar monto restante
                const remaining = (selectedDebt.amount || 0) - amt;
                if (remaining <= 0.0001) {
                  await fetch(`http://localhost:5000/api/finances/${selectedDebt.id}`, { method: 'DELETE' });
                } else {
                  const updPayload = { kind: 'debt', amount: remaining, date: selectedDebt.date, category: selectedDebt.category, notes: `${selectedDebt.notes || ''} (restante)` };
                  await fetch(`http://localhost:5000/api/finances/${selectedDebt.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(updPayload) });
                }

                setShowPayModal(false);
                setSelectedDebt(null);
                setPayAmount('');
                fetchAll();
                fetchSummary();
              } catch (err) { console.error(err); }
            }}>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <input type="number" step="0.01" value={payAmount} onChange={(e)=>setPayAmount(e.target.value)} />
                <div style={{ display:'flex', gap:8 }}>
                  <button type="submit">Confirmar pago</button>
                  <button type="button" onClick={()=>{ setShowPayModal(false); setSelectedDebt(null); }}>Cancelar</button>
                </div>
              </div>
            </form>
          </div>
        </div>, document.body)
      }

      {showClearConfirm && createPortal(
        <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar borrado</h3>
            <p>¿Seguro que quieres borrar todas las transacciones? Esta acción no se puede deshacer.</p>
            <div style={{ display:'flex', gap:8 }}>
              <button className="danger" onClick={async () => {
                try {
                  const res = await fetch('http://localhost:5000/api/finances/clear', { method: 'DELETE' });
                  if (res.ok) {
                    setShowClearConfirm(false);
                    fetchAll();
                    fetchSummary();
                  } else {
                    console.error('Error borrando datos');
                  }
                } catch (err) { console.error(err); }
              }}>Borrar todo</button>
              <button onClick={() => setShowClearConfirm(false)}>Cancelar</button>
            </div>
          </div>
        </div>, document.body)
      }

      {showModal && createPortal(
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Añadir {modalType === 'income' ? 'Ingreso' : modalType === 'expense' ? 'Gasto' : 'Deuda'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const payload = { kind: modalType, amount: parseFloat(form.amount), date: form.date, category: form.category, notes: form.notes };
              try {
                const res = await fetch('http://localhost:5000/api/finances/create', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
                if (res.ok) { setShowModal(false); setForm({ ...form, amount: '', category: '', notes: '', date: todayIso }); fetchAll(); fetchSummary(); }
              } catch(err) { console.error(err); }
            }}>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <input type="number" step="0.01" placeholder="Cantidad" value={form.amount} onChange={(e)=>setForm({...form, amount: e.target.value})} required />
                <input type="date" value={form.date} onChange={(e)=>setForm({...form, date: e.target.value})} />
                <input placeholder="Categoría" value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})} />
                <input placeholder="Notas" value={form.notes} onChange={(e)=>setForm({...form, notes: e.target.value})} />
                <div style={{ display:'flex', gap:8 }}>
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={()=>setShowModal(false)}>Cancelar</button>
                </div>
              </div>
            </form>
          </div>
        </div>, document.body)
      }
    </div>
  );
}

export default FinanceView;
