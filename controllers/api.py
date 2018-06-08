import tempfile
import traceback
import json

# Cloud-safe of uuid, so that many cloned servers do not all use the same uuids.
from gluon.utils import web2py_uuid

# Here go your api methods.

# To do:
# Form checking (check that the form is not empty when a new track is added)
# User checking
# Sharing

# Let us have a serious implementation now.
def check():
    response.headers['Access-Control-Allow-Origin']= '*'
    you = 'None' if logged_in_user is None else logged_in_user['username']
    return response.json(dict(result=you))


def saved_orders():
    response.flash = T("Hello World")
    return dict(message=T('Welcome to web2py!'))
    
def login():
    response.headers['Access-Control-Allow-Origin']= '*'
    username = request.vars.username
    h = hashlib.sha256(SECRET_KEY)
    h.update(request.vars.password)
    r = db((db.myuser.username == username)&
        (db.myuser.password == h.hexdigest())).select().first()
    if r is None:
        return response.json(dict(result='fail'))
    #Creates a new token 
    if r.token is None:
         token = web2py_uuid()
         r.update_record(token = token)

    return response.json(dict(result='logged in', token=token))

def logout():
    response.headers['Access-Control-Allow-Origin']= '*'
    r = db((db.myuser.username == username)&
    (db.myuser.password == h.hexdigest())).select().first()
    if r is None: 
        r.update_record(token = None)
    return response.json(dict(result='logged in', token=None))

@auth.requires_signature(hash_vars=False)
def get_menuItems():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    menuItems = []
    has_more = False
    rows = db().select(db.menuItems.ALL, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            t = dict(
                name = r.name,
                price = r.price,
                allergens = r.allergens,
                description = r.description
                # nutrition = r.nutrition,
                # category = r.category,
                # id = r.id,
                # ingredients = r.ingredients,
                # is_featured = r.is_features,
            )
            menuItems.append(t)
        else:
            has_more = True
    logged_in = auth.user is not None
    return response.json(dict(
        menuItems=menuItems,
        logged_in=logged_in,
        has_more=has_more
    ))

# used in checkout to either display or hide different options
def check_logged_in():
    logged_in = auth.user is not None
    return response.json(dict(
        logged_in=logged_in
    ))

def purchase():
    logger.info("PART 1")
    """Ajax function called when a customer orders and pays for the cart."""
    logger.info("PART 2")
    # Creates the charge.
    import stripe
    logger.info("PART 3")
    # Your secret key.
    stripe.api_key = configuration.get('stripe.private_key')
    logger.info("PART 4")
    token = json.loads(request.vars.transaction_token)
    logger.info("PART 5")
    amount = float(request.vars.amount)
    logger.info("PART 6")
    try:
        logger.info("PART 7")
        charge = stripe.Charge.create(
            amount=int(amount * 100),
            currency="usd",
            source=token['id'],
            description="Purchase",
        )
    except stripe.error.CardError as e:
        logger.info("The card has been declined.")
        logger.info("%r" % traceback.format_exc())
        return "nok"
    """
    db.customer_order.insert(
        customer_info=request.vars.customer_info,
        transaction_token=json.dumps(token),
        cart=request.vars.cart)
        """
    return "ok"

@auth.requires_signature()
def get_insertion_id():
    insertion_id = web2py_uuid()
    return response.json(dict(
        insertion_id=insertion_id
    ))

@auth.requires_signature()
def add_item():
    """Received the metadata for a new track."""
    # Inserts the track information.
    t_id = db.menuItems.insert(
        name=request.vars.name,
        price=request.vars.price,
        allergens=request.vars.allergens,
        description=request.vars.description,
        id=db(db.menuItems.id > 0).select().last().id +1
        # nutrition=request.vars.nutrition,
        # category=request.vars.category,
        # ingredients=request.vars.ingredients,
        # is_featured=request.vars.is_features,
    )
    return response.json(dict(menuItems=dict(
        id=t_id
    )))

@auth.requires_signature()
def del_menuItem():
    "Deletes a track from the table"
    db(db.menuItems.id == request.vars.menuItems_id).delete()
    # The next line is likely useless, as this is taken care by SQL deletion cascading.
    db(db.menuItems_data.menuItems_id == request.vars.menuItems_id).delete()
    return "ok"

def save_order():
    return "ok"

# NOTE that we cannot hash the variables, otherwise we cannot produce the URL server-side.
@auth.requires_signature()
def upload_track():
    "Uploads the file related to a track"
    logger.info("_signature: %r", request.vars._signature)
    logger.info("Track insertion id: %r", request.vars.insertion_id)
    # First, we delete other incomplete uploads.
    db(db.track_data.track_id == None).delete()
    logger.info("Uploaded a file of type %r" % request.vars.file.type)
    if not request.vars.file.type.startswith('audio'):
        raise HTTP(500)
    # Inserts the new track.
    insertion_id = db.track_data.insert(
        track_id=None, # We don't know it yet.
        original_filename=request.vars.file.filename,
        data_blob=request.vars.file.file.read(),
        mime_type=request.vars.file.type,
        insertion_id=request.vars.insertion_id,
    )
    return response.json(dict(
        insertion_id=insertion_id
    ))

@auth.requires_signature()
def cleanup():
    """Removes incomplete uploads."""
    db(db.track_data.track_id == None).delete()


@auth.requires_signature()
def delete_music():
    """Deletes the file associated with a track, as we have uploaded a new one."""
    track_id = request.vars.track_id
    if track_id is None:
        raise HTTP(500)
    db(db.track_data.track_id == track_id).delete()
    return "ok"

@auth.requires_signature()
def play_track():
    track_id = int(request.vars.track_id)
    t = db(db.track_data.track_id == track_id).select().first()
    if t is None:
        return HTTP(404)
    headers = {}
    headers['Content-Type'] = t.mime_type
    # Web2py is setup to stream a file, not a data blob.
    # So we create a temporary file and we stream it.
    # f = tempfile.TemporaryFile()
    f = tempfile.NamedTemporaryFile()
    f.write(t.data_blob)
    f.seek(0) # Rewind.
    return response.stream(f.name, chunk_size=4096, request=request)

@auth.requires_signature()
def inc_plays():
    track_id = int(request.vars.track_id)
    t = db.track[track_id]
    t.update_record(num_plays = t.num_plays + 1)
    return "ok"
