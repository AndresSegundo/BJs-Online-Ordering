import datetime

def get_user_email():
    return auth.user.email if auth.user else None


db.define_table('myuser',
                Field('username'),
                Field('password'),
                Field('token')
                )

#Gets the identity of the logged in user.
logged_in_user = None
if request.vars.token is not None: 
    r = db(db.myuser.token ==
        request.vars.token).select().first()
    if r is not None:
        logged_in_user = dict(
            username = r.username
            )
        logger.info("User: %r" % r.username)

db.define_table('menuItems',
                Field('name'),
                Field('price'),
                Field('allergens'),
                Field('image'),
                Field('description'),
                Field('nutrition'),
                Field('category'),
                Field('id'),
                Field('ingredients'),
                Field('is_featured')
                )

db.define_table('menuItems_data',
                Field('menu_id', 'reference menuItems'),
                Field('original_filename'),
                Field('data_blob', 'blob'),
                Field('mime_type'),
                )

db.define_table('account',
                Field('name'),
                Field('email'),
                Field('is_student'),
                Field('phone_num'),
                Field('order_hist'),
                # Temp Credit Card Info
                Field('cc_num'),
                Field('cc_exp'),
                Field('cc_cvc'),
                Field('cc_name'),
                Field('cc_address'),
                Field('log_info'),
                )


db.define_table('orders',
                Field('user_email'),
                Field('item_id'),
                Field('comments'),
                Field('updated_on'),
                )