import { useEffect, useState } from 'react';

function ItemManagement() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:3000/api/item';

  // Fetch items
  async function fetchItems() {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?page=${page}&limit=5`);
      const data = await response.json();
      console.log("API response:", data);
      setItems(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, [page]);

  // Create item
  async function handleCreate(e) {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName,
          itemCategory,
          itemPrice: parseFloat(itemPrice)
        })
      });
      
      if (response.ok) {
        clearForm();
        fetchItems();
        alert('Item created!');
      } else {
        const data = await response.json();
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }
  }

  // Update item
  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName,
          itemCategory,
          itemPrice: parseFloat(itemPrice)
        })
      });
      
      if (response.ok) {
        clearForm();
        setEditingId(null);
        fetchItems();
        alert('Item updated!');
      } else {
        const data = await response.json();
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }

  // Delete item
  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('Delete response:', response);
      
      if (response.ok) {
        fetchItems();
        alert('Item deleted!');
      } else {
        const data = await response.json();
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  // Edit item (fill form)
  function handleEdit(item) {
    setEditingId(item._id);
    setItemName(item.itemName);
    setItemCategory(item.itemCategory);
    setItemPrice(item.itemPrice.toString());
  }

  // Clear form
  function clearForm() {
    setItemName('');
    setItemCategory('');
    setItemPrice('');
    setEditingId(null);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Item Management</h1>

      {/* Form */}
      <form onSubmit={editingId ? handleUpdate : handleCreate} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>{editingId ? 'Edit Item' : 'Add New Item'}</h2>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Item Name: </label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            style={{ padding: '8px', width: '200px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Category: </label>
          <input
            type="text"
            value={itemCategory}
            onChange={(e) => setItemCategory(e.target.value)}
            required
            style={{ padding: '8px', width: '200px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Price: </label>
          <input
            type="number"
            step="0.01"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            required
            style={{ padding: '8px', width: '200px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>
          {editingId ? 'Update' : 'Create'}
        </button>
        
        {editingId && (
          <button type="button" onClick={clearForm} style={{ padding: '10px 20px' }}>
            Cancel
          </button>
        )}
      </form>

      {/* Items Table */}
      <h2>Items List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Category</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Price</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Status</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items && items.map((item) => (
              <tr key={item._id}>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{item.itemName}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{item.itemCategory}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>${item.itemPrice}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{item.status}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <button onClick={() => handleEdit(item)} style={{ marginRight: '5px' }}>Edit</button>
                  <button onClick={() => { alert('Delete clicked: ' + item._id);  handleDelete(item._id); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))} 
          disabled={page === 1}
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button 
          onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
          disabled={page === totalPages}
          style={{ padding: '10px 20px', marginLeft: '10px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ItemManagement;
