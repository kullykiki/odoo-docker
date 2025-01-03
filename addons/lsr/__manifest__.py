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
        'views/period.xml',
        'views/room.xml',
        # 'views/approver.xml',
        'views/booking.xml',
        'views/views.xml',
        'views/login.xml',
        'views/weblayout_custom.xml',
        'views/website_menu.xml',
        # 'views/website_templates.xml',
        'views/lsr_templates.xml',
        'data/sequence.xml',
        'data/period.xml',
        'data/room_type.xml',
        'data/room.xml',
    ],
    # only loaded in demonstration mode
    'demo': [],
    'assets': {
        'web.assets_backend': [          
            'lsr/static/src/scss/poppins.scss',
            'lsr/static/src/scss/prompt.scss',
            'lsr/static/wickedpicker/dist/wickedpicker.min.css',
            'lsr/static/wickedpicker/dist/wickedpicker.min.js',
            'lsr/static/src/xml/timepicker_templates.xml',
            'lsr/static/src/js/time_widget.js',
        ],
        'web.assets_frontend': [          
            'lsr/static/src/scss/poppins.scss'
            'lsr/static/src/scss/prompt.scss'
            'lsr/static/src/scss/theme.scss',
        ],
        'web._assets_primary_variables': [
            ('after', 'website/static/src/scss/primary_variables.scss','lsr/static/src/scss/colortemplete.scss'),
            # ('prepend', 'webtest/static/src/scss/colortemplete.scss'),
        ],
    },
}

