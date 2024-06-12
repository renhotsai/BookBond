const OrderStatus = {
    Pending: 'Pending', // tenant: Waiting / Cancel, landlord: Accept / Denied 
    Cancelled: 'Cancelled', // only tenant can cancel 
    Accepted: 'Accepted', // only landlord can accept
    Denied: 'Deny', // only landlord can deny
    Picked: 'Picked', // only tenant can pick
    Returned: 'Returned', // only tenant can return
    Checked: 'Checked', // only landlord can check
}

export default OrderStatus;