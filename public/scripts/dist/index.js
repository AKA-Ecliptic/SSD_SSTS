"use strict";
// INTERFACES
// GLOBAL VARIABLES
var currentUser;
// PASSIVE REQUESTS
$.get('/users', (data) => {
    let welcome = `Hello ${data}`;
    currentUser = data;
    $('#id-display').html(welcome);
});
$.get('/tickets/all', (data) => {
    populateTicketView(data);
});
$.get('/tickets', (data) => {
    let tickets = data;
    tickets.forEach(ticket => {
        let ticket_html = '<div class="card">' +
            `<div class="card-body">` +
            '<div class="card-title">' +
            `<i class="material-icons ${ticket.priority}">report</i>` +
            `<h5 class="ticket-title">${ticket.title}</h5>` +
            '</div>' +
            `<div class="card-subtitle focus-ticket" data-ticket="${ticket._id}">` +
            `<h6 class="ticket-date">${formatDate(ticket.posted)[1]}</h6>` +
            '<i class="material-icons">chevron_right</i>' +
            '</div>' +
            `<span class="status-${ticket.status}"></span>`;
        '</div>' +
            '</div>';
        $('#ticket-list').append(ticket_html);
    });
    assignListener();
});
$.get('/users/all', (data) => {
    let selectes = '';
    for (let user in data) {
        selectes += `<option>${data[user]}</option>`;
    }
    $('#atm-user-select').html(selectes);
});
// HELPER FUNCTIONS
function clearFocused() {
    $('#focused-ticket').html('');
    toggleBackVisibility(false);
}
function clearTicketView() {
    $('#all-tickets').html('<div class="ctnr-active-tickets"></div>' +
        '<div class="ctnr-inactive-tickets"></div>');
}
function toggleBackVisibility(isVisible) {
    if (isVisible) {
        $('#header-back').removeClass('invisible');
    }
    else {
        $('#header-back').addClass('invisible');
    }
}
function formatDate(date) {
    let working_date = date.toLocaleString('en-GB').split('T')[0];
    let date_components = working_date.split('-');
    // 0 = year, 1 = month, 2 = day 
    let isoDate = `${date_components[0]}/${date_components[1]}/${date_components[2]}`;
    let mdDate = `${date_components[1]}/${date_components[2]}`;
    return [isoDate, mdDate];
}
function formatId(id) {
    return (id.startsWith('@')) ? id : '@' + id;
}
// Trigger Functions
$('#header-back').on('click', () => {
    $.get('/tickets/all', (data) => {
        populateTicketView(data);
    });
});
$('#atm-submit').on('click', () => {
    let inputs = $('#atm-form').find('[id^="atm"]').toArray();
    let isValid = true;
    for (let e in inputs)
        if (inputs[e].value.replace(/\s/g, '').length == 0)
            isValid = false;
    if (isValid)
        $('#atm-form').trigger('submit');
});
function assignListener() {
    $('.focus-ticket').on('click', (event) => {
        let i_tag = event.currentTarget;
        if (i_tag) {
            let ticket_id = i_tag.getAttribute('data-ticket');
            $.get(`/tickets/get/${ticket_id}`, (data) => {
                clearTicketView();
                toggleBackVisibility(true);
                focusTicket(data);
            });
        }
    });
}
function assignCommentListener(ticketId, enableComments) {
    $('#comment-submit').on('click', () => {
        let text = $('#comment-input').val();
        if (text.replace(/\s/g, '').length > 0 && enableComments) {
            $.post('/tickets/comment', { ticket: ticketId, text: text }, (data) => {
                if (data) {
                    appendComment(data);
                    $('#comment-input').val('');
                }
            });
        }
    });
}
function assignedFocusedListener(ticketId) {
    let user = '';
    $.get('/users', (data) => {
        user = data;
    });
}
function assignEditModalListener() {
    $('#etm-save').on('click', () => {
        $('#etm-form').trigger('submit');
    });
}
function deleteTicket(id) {
    let message = 'Are you sure you want to delete this ticket, this can\'t be undone?';
    let response = confirm(message);
    if (response) {
        $.post(`tickets/delete/${id}`, (data) => { location.reload(); });
    }
}
// DOM MANIPULATION FUNCTIONS
function populateTicketView(tickets) {
    clearFocused();
    toggleBackVisibility(false);
    $('.ctnr-active-tickets').html('<h5 class="section-head">Active Tickets</h5>');
    $('.ctnr-inactive-tickets').html('<h5 class="section-head">Inactive Tickets</h5>');
    tickets.forEach(ticket => {
        let ticketHTML = getTicketTask(ticket);
        if (ticket.status == 'OPEN') {
            $('.ctnr-active-tickets').append(ticketHTML);
        }
        else {
            $('.ctnr-inactive-tickets').append(ticketHTML);
        }
    });
    assignListener();
}
function getTicketTask(ticket) {
    return '<div class="card ticket-task"> <div class="card-body"> <div class="tt-info">' +
        `<i class="material-icons ${ticket.priority}">report</i>` +
        `<h5>${ticket.title}</h5>` +
        `<h6>${formatDate(ticket.posted)[0]}</h6>` +
        '</div>' +
        '<div class="dropright tt-dropright">' +
        `<i class="material-icons tt-more" id="dropdownMenuButton" data-toggle="dropdown">more_vert</i>` +
        '<div class="dropdown-menu">' +
        `<a class="dropdown-item focus-ticket" data-ticket="${ticket._id}">View</a>` +
        '</div>' +
        '</div>' +
        '</div>' +
        `<span class="status-${ticket.status}"></span>` +
        '</div>';
}
function focusTicket(ticketComment) {
    let output = '';
    let enableComments = (ticketComment.status == 'OPEN');
    output += getTicketContents(ticketComment);
    output += getCommentBar(enableComments);
    output += '<div class="ft-ctnr-comments">';
    ticketComment.comments.forEach(comment => {
        output += getComment(comment);
    });
    output += '</div>';
    $('#focused-ticket').html(output);
    assignCommentListener(ticketComment._id, enableComments);
}
function getTicketContents(ticket) {
    let showMore = (currentUser == ticket.founder_id || currentUser == ticket.assigned_id) ? '' : 'invisible';
    return '<div class="jumbotron ft-content">' +
        '<div class="ft-header">' +
        `<h5 id="ft-title">${ticket.title}</h5>` +
        `<h6 id="ft-date">${formatDate(ticket.posted)[0]}</h6>` +
        '</div>' +
        '<hr class="my-1">' +
        `<div id="ft-description">${ticket.description}</div>` +
        '<hr class="my-1">' +
        '<div class="ft-info">' +
        `<h6 id="ft-users">Found by: ${formatId(ticket.founder_id)} | Assigned to: ${formatId(ticket.assigned_id)}</h6>` +
        `<div class="dropright tt-dropright ${showMore}">` +
        `<i class="material-icons tt-more" id="dropdownMenuButton" data-toggle="dropdown">more_vert</i>` +
        '<div class="dropdown-menu">' +
        `<a class="dropdown-item" onclick='initialiseEditModal(${JSON.stringify(ticket)})'>Edit</a>` +
        `<a class="dropdown-item" onclick='deleteTicket(${ticket._id})'>Delete</a>` +
        '</div>' +
        '</div>' +
        '</div></div>';
}
function getCommentBar(enabled) {
    let enableComments = (enabled) ? '' : 'disabled';
    return '<div class="input-group ft-input-comment">' +
        `<textarea type="text" class="form-control" placeholder="Comment" id="comment-input" ${enableComments}></textarea> ` +
        '<div class="input-group-append">' +
        `<button class="btn" type="button" id="comment-submit" ${enableComments}>Submit</button>` +
        '</div>' +
        '</div>';
}
function getComment(comment) {
    return '<div class="card ft-comment">' +
        '<div class="card-header ft-comment-details">' +
        `<h6 class="ft-comment-poster">${formatId(comment.user_id)}</h6>` +
        `<p class="ft-comment-date">${formatDate(comment.posted)[0]}</p>` +
        '</div>' +
        `<p class="ft-commment-text">${comment.text}</p>` +
        '</div>';
}
function appendComment(comment) {
    let toAppend = '<div class="card ft-comment">' +
        '<div class="card-header ft-comment-details">' +
        `<h6 class="ft-comment-poster">${formatId(comment.user_id)}</h6>` +
        `<p class="ft-comment-date">${formatDate(comment.posted)[0]}</p>` +
        '</div>' +
        `<p class="ft-commment-text">${comment.text}</p>` +
        '</div>';
    $('#focused-ticket').append(toAppend);
}
function initialiseEditModal(ticket) {
    let editModal = `<div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">New Ticket</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
            <form method="POST" action="/tickets/update/${ticket._id}" id="etm-form">
                <div class="input-group">
                <div class="input-group-prepend">
                    <label class="input-group-text" for="etm-priority-select">Priority</label>
                </div>
                <select class="custom-select" id="etm-priority-select" name="priority" required>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>
                </div>
                <div class="input-group">
                <div class="input-group-prepend">
                    <label class="input-group-text" for="etm-status-select">Status</label>
                </div>
                <select class="custom-select" id="etm-status-select" name="status" required>
                    <option value="OPEN">Open</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                </select>
                </div>
            </form>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="etm-save">Save</button>
            </div>
        </div>
    </div>`;
    $('#edit-ticket-modal').html(editModal);
    $('#edit-ticket-modal').modal('show');
    $('#edit-ticket-modal').on('hidden.bs.modal', () => {
        $('#edit-ticket-modal').html('');
    });
    assignEditModalListener();
}
