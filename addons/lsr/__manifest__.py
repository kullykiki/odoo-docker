# -*- coding: utf-8 -*-
{
    'name': "learning space reservation",

    'summary': "Short (1 phrase/line) summary of the module's purpose",

    'description': """
Long description of module's purpose
    """,

    'author': "My Company",
    'website': "https://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',
    'license': 'LGPL-3',
    'depends': ['base','hr','web','website','mail'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'security/group.xml',
        'views/templates.xml',
        'views/room.xml',
        'views/approver.xml',
        'views/booking.xml',
        'views/views.xml',
        'views/weblayout_custom.xml',
        'views/website_menu.xml',
        # 'views/website_templates.xml',
        'views/lsr_templates.xml',
        'data/sequence.xml',
        'data/room_type.xml',
    ],
    # only loaded in demonstration mode
    'demo': [],
    'assets': {
        'web.assets_backend': [          
            'https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
        ],
        'web.assets_frontend': [          
            'lsr/static/src/scss/theme.scss',
            'https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
        ],
        'web._assets_primary_variables': [
            ('after', 'website/static/src/scss/primary_variables.scss','lsr/static/src/scss/colortemplete.scss'),
            # ('prepend', 'webtest/static/src/scss/colortemplete.scss'),
        ],
    },
}

