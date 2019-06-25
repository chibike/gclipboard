# Generated by Django 2.1 on 2019-06-25 09:49

import basic_app.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('basic_app', '0003_auto_20190613_2322'),
    ]

    operations = [
        migrations.CreateModel(
            name='Shareables',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unique_url', models.CharField(default=basic_app.models.generate_unique_name, max_length=1000)),
                ('date_created', models.DateTimeField(default=django.utils.timezone.now)),
                ('expiry_date', models.DateTimeField(default=basic_app.models.return_future_date)),
                ('request_limit', models.IntegerField(default=5)),
                ('request_count', models.IntegerField(default=0)),
                ('cliboard_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='basic_app.Clipboard')),
            ],
        ),
    ]
