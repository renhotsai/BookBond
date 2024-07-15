const OrderStatus = {
    Pending: 'Pending', // tenant: Waiting / Cancel, landlord: Accept / Denied 
    Cancelled: 'Cancelled', // only tenant can cancel 
    Accepted: 'Accepted', // only landlord can accept
    Denied: 'Deny', // only landlord can deny
    Picked: 'Picked', // only tenant can pick
    Returned: 'Returned', // only tenant can return
    Checked: 'Checked', // only landlord can check
}

const statusColors = {
    Pending: 'blue',
    Cancelled: 'cyan',
    Accepted: 'purple',
    Denied: 'gray',
    Picked: 'orange',
    Returned: 'green',
    Checked: 'cyan',
    'Waiting to Pick up': 'purple'    
};

export {
    OrderStatus,
    statusColors
};