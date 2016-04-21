This page describes how to do some things that commonly need to be done when building an application on top of TerriaJS.

# Add a catalog item to the initial catalog that is loaded at startup

The startup list of init files loaded in a TerriaJS application is specified in the `initializationUrls` property in a config file, typically called `config.json`, that is passed to the `Terria.start` function.  If an item in `initializationUrls` ends with `.json`, it is assumed to be a relative or absolute URL to the init file.  Otherwise, the init file URL is formed as `'init/' + item + '.json'`.

To add an item to the catalog, the easiest thing to do is to find a similar item in the list and mirror yours after that.  You can also find the complete list of catalog member "types" in [registerCatalogMembers.js](https://github.com/TerriaJS/terriajs/blob/master/lib/Models/registerCatalogMembers.js).  The list of properties that are supported by a given catalog item type can be found in each view-model class's code (for example, [WebMapServiceCatalogItem](https://github.com/TerriaJS/terriajs/blob/master/src/Models/WebMapServiceCatalogItem.js)) and documentation (generated with `gulp docs`).

# Gain programmatic access to the Catalog and Now Viewing panels

Most applications built on National Map will include their own version of [main.js](https://github.com/NICTA/nationalmap/blob/master/src/viewer/main.js).  It is this source file that creates the `ApplicationViewModel` and `CatalogViewModel`.  Your version of `main.js` can create any additional UI components you need and pass these objects through to them.

# Find a item or group in the catalog

The easiest way to find an item in the catalog is to use the `findFirstItemByName` method on `CatalogGroupViewModel`:

    var catalog = ...; // catalog is an instance of CatalogViewModel
    var topLevelGroup = catalog.group;
    var national = topLevelGroup.findFirstItemByName('National Data Sets');
    var vegetation = national.findFirstItemByName('Vegetation');

You can also loop over the individual items manually as you would any Javascript array:

    // Find an item by inspecting descriptions.
    var myItem;
    for (var i = 0; i < national.items.length; ++i) {
        if (national.items[i].description.indexOf('foo') >= 0) {
            myItem = national.items[i];
        }
    }

# Enable, disable, hide, or show a catalog item

You can enable a catalog item programmatically just by setting its `isEnabled` property.

    myItem.isEnabled = true;

The item will be added to the Now Viewing panel and shown on the map.

You can hide it from the map (which will uncheck it in the Now Viewing panel but not remove it from that panel) by setting the `isShown` property:

    myItem.isShown = false;

You can show or disable it in the same way:

    myItem.isShown = true;
    myItem.isEnabled = false;

Enabling a catalog item that is already enabled but not shown will NOT cause it to be shown.

# Programmatically add an item to the catalog

To programmatically add an item to the catalog, first, find the group you want to add it to:

    var catalog = ...; // catalog is an instance of CatalogViewModel
    var topLevelGroup = catalog.group;
    var national = topLevelGroup.findFirstItemByName('National Data Sets');
    var myGroup = national.findFirstItemByName('Vegetation');

As of this writing, the National Map user interface currently requires two levels of groups before an actual catalog item.  For example, you can put a catalog item under `National Data Sets -> Vegetation` but not directly under `National Data Sets`.

Next, create a new catalog item view-model of the appropriate type and set its properties.  View-models are found in [src/ViewModels](https://github.com/NICTA/nationalmap/tree/master/src/ViewModels) and have `ItemViewModel` in their name.  For example:

    var newItem = new WebMapServiceItemViewModel(catalog.application);
    newItem.name = 'An AMAZING data source!';
    newItem.description = 'This data source is so great, I can't even describe it.';
    newItem.url = 'http://geoserver.research.nicta.com.au/geotopo_250k/ows';
    newItem.layers = 'AHGFMappedStream';

The reference documentation generated by running `gulp docs` is a good source of information about the available properties of each catalog item view-model and what they mean.

Finally, add the new item to the group you found earlier:

    myGroup.add(newItem);

The user interface will automatically update to show the new item.

# Add a new type of catalog item

You can add a new type of catalog item to National Map by extending `CatalogItemViewModel`.  The existing catalog items in National Map, such as [WebMapServiceItemViewModel](https://github.com/NICTA/nationalmap/blob/master/src/ViewModels/WebMapServiceItemViewModel.js) and [GeoJsonItemViewModel](https://github.com/NICTA/nationalmap/blob/master/src/ViewModels/GeoJsonItemViewModel.js) serve as good examples of how to do this.

In order for the new data source to be configurable via `init_nm.json`, you also need to add it to [registerCatalogViewModels.js](https://github.com/NICTA/nationalmap/blob/master/src/ViewModels/registerCatalogViewModels.js) with a unique `type` identifier.

If you wrote a new type of catalog item that might be of use to other projects using National Map, you should open a pull request!

# Add a new type of group

It is also possible to extend National Map with custom catalog item groups.  This is done when you want part of your catalog to be built by querying a remote server.  For example, National Map includes an out-of-the-box group to retrieve data sources from a WMS server's `GetCapabilities` response.

To create a custom type of group, extend `CatalogGroupViewModel`.  [WebMapServiceGroupViewModel.js](https://github.com/NICTA/nationalmap/blob/master/src/ViewModels/WebMapServiceGroupViewModel.js) serves as a good example of how to do this.

In order for the new group to be configurable via `init_nm.json`, you also need to add it to [registerCatalogViewModels.js](https://github.com/NICTA/nationalmap/blob/master/src/ViewModels/registerCatalogViewModels.js) with a unique `type` identifier.

If you wrote a new type of catalog item group that might be of use to other projects using National Map, you should open a pull request!