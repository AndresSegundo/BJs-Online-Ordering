# -*- coding: utf-8 -*-
# -------------------------------------------------------------------------
# This is a sample controller
# this file is released under public domain and you can use without limitations
# -------------------------------------------------------------------------

# ---- example index page ----
def index():
    response.flash = T("Hello World")
    user_image = None
    if auth.user:
        curr_user = db(db.auth_user.email == auth.user.email).select().first()
        # name stored in picture field, NOT picture_file
        user_image = curr_user.picture
    return dict(message=T('Welcome to web2py!'), user_image=user_image)

def navbar():
    user_image = None
    if auth.user:
        curr_user = db(db.auth_user.email == auth.user.email).select().first()
        # name stored in picture field, NOT picture_file
        user_image = curr_user.picture
    return dict(user_image=user_image)

def menu():
    response.flash = T("Hello World")
    user_image = None
    if auth.user:
        curr_user = db(db.auth_user.email == auth.user.email).select().first()
        # name stored in picture field, NOT picture_file
        user_image = curr_user.picture
    return dict(message=T('Welcome to web2py!'), user_image=user_image)

def cart():
    response.flash = T("Hello World")
    user_image = None
    if auth.user:
        curr_user = db(db.auth_user.email == auth.user.email).select().first()
        # name stored in picture field, NOT picture_file
        user_image = curr_user.picture
    return dict(message=T('Welcome to web2py!'), user_image=user_image)

def checkout():
    response.flash = T("Hello World")
    user_image = None
    if auth.user:
        curr_user = db(db.auth_user.email == auth.user.email).select().first()
        # name stored in picture field, NOT picture_file
        user_image = curr_user.picture
    return dict(message=T('Welcome to web2py!'), user_image=user_image)

def saved_orders():
    response.flash = T("Hello World")
    user_image = None
    if auth.user:
        curr_user = db(db.auth_user.email == auth.user.email).select().first()
        # name stored in picture field, NOT picture_file
        user_image = curr_user.picture
    return dict(message=T('Welcome to web2py!'),user_image=user_image)

@auth.requires_login()
def admin():
    response.flash = T("Hello World")
    return dict(message=T('Welcome to web2py!'))


# ---- API (example) -----
@auth.requires_login()
def api_get_user_email():
    if not request.env.request_method == 'GET': raise HTTP(403)
    return response.json({'status':'success', 'email':auth.user.email})

# ---- Smart Grid (example) -----
@auth.requires_membership('admin') # can only be accessed by members of admin groupd
def grid():
    response.view = 'generic.html' # use a generic view
    tablename = request.args(0)
    if not tablename in db.tables: raise HTTP(403)
    grid = SQLFORM.smartgrid(db[tablename], args=[tablename], deletable=False, editable=False)
    return dict(grid=grid)

# ---- Embedded wiki (example) ----
def wiki():
    auth.wikimenu() # add the wiki to the menu
    return auth.wiki() 

# ---- Action for login/register/etc (required for auth) -----
def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    http://..../[app]/default/user/bulk_register
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    also notice there is http://..../[app]/appadmin/manage/auth to allow administrator to manage users
    """
    user_image = None
    if auth.user:
        curr_user = db(db.auth_user.email == auth.user.email).select().first()
        # name stored in picture field, NOT picture_file
        user_image = curr_user.picture
    return dict(form=auth(), user_image=user_image)

# ---- action to server uploaded static content (required) ---
@cache.action()
def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)

def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()