(function() {
  var $, root;

  root = this;

  $ = jQuery;

  describe("Collector (Base)", function() {
    beforeEach(function() {
      this.html = '<select><option value="1">first</option><option value="2">second</option></select>';
      return this.widget = $(this.html).appendTo($('body')).collector();
    });
    afterEach(function() {
      this.widget.collector('destroy');
      return this.widget.remove();
    });
    it("should generate an options list", function() {
      return expect(this.widget.collector('menu').find('li').length).toEqual(2);
    });
    it("should provide a value getter", function() {
      return expect(this.widget.collector('value')).toEqual('1');
    });
    it("should change value when an option is clicked", function() {
      this.widget.collector('menu').find('li:eq(1)').click();
      return expect(this.widget.collector('value')).toEqual('2');
    });
    it("should distribute new value to the original element", function() {
      this.widget.collector('value', 2);
      return expect(this.widget.val()).toEqual('2');
    });
    it("should trigger change event when value changes through value setter", function() {
      spyOnEvent(this.widget, 'collectorchange');
      this.widget.collector('value', 'second');
      return expect('collectorchange').toHaveBeenTriggeredOn(this.widget);
    });
    it("should trigger change event when an options is clicked changes through value setter", function() {
      spyOnEvent(this.widget, 'collectorchange');
      this.widget.collector('menu').find('li:eq(1)').click();
      return expect('collectorchange').toHaveBeenTriggeredOn(this.widget);
    });
    it("should hide the original dom-element", function() {
      return expect(this.widget).not.toBeVisible();
    });
    it("should remove the option list on cleanup", function() {
      this.widget.collector('destroy');
      expect(this.widget.collector('menu')).not.toExist();
      return expect(this.widget).toBeVisible();
    });
    return it("should provide an option to specify the available choices", function() {
      var widget;
      widget = $('<div />').appendTo($('body')).collector({
        options: [
          {
            value: 1,
            label: 'no 1'
          }, {
            value: 2,
            label: 'no 2'
          }, {
            value: 3,
            label: 'no 3'
          }
        ]
      });
      this.after(function() {
        widget.collector('destroy');
        return widget.remove();
      });
      return expect($.map(widget.collector('menu').find('li'), function(a) {
        return $(a).text();
      })).toEqual(['no 1', 'no 2', 'no 3']);
    });
  });

  describe("Collector (Display)", function() {
    beforeEach(function() {
      this.html = '<select><option value="1">first</option><option value="2">second</option></select>';
      return this.widget = $(this.html).appendTo($('body')).collector();
    });
    afterEach(function() {
      this.widget.collector('destroy');
      return this.widget.remove();
    });
    it("should render a value displayer", function() {
      return expect(this.widget.collector('display')).toExist();
    });
    it("should remove the value displayer at destroy", function() {
      this.widget.collector('destroy');
      return expect(this.widget.collector('display')).not.toExist();
    });
    it("should update the display when the value changes", function() {
      this.widget.collector('value', '2');
      expect(this.widget.collector('display').text()).toEqual('second');
      this.widget.collector('menu').find('li:first').click();
      return expect(this.widget.collector('display').text()).toEqual('first');
    });
    return it("should show a placeholder text", function() {
      var widget2;
      widget2 = $('<select><option></option><option value="1">first</option><option value="2">second</option></select>').appendTo('body').collector({
        placeholder: 'Make a choice!'
      });
      expect(widget2.collector('display').text()).toEqual('Make a choice!');
      widget2.collector('destroy');
      return widget2.remove();
    });
  });

  describe("Collector (Toggling)", function() {
    beforeEach(function() {
      this.html = '<select><option value="1">first</option><option value="2">second</option><option value="3">third</option></select>';
      return this.widget = $(this.html).appendTo($('body')).collector();
    });
    afterEach(function() {
      this.widget.collector('destroy');
      return this.widget.remove();
    });
    it("should render the displayer and options menu withing a wrapper", function() {
      expect(this.widget.collector('container')).toExist();
      expect(this.widget.collector('container')).toContain('select');
      expect(this.widget.collector('container')).toContain('a.cllctr-display');
      return expect(this.widget.collector('container')).toContain('ul.cllctr-options');
    });
    it("should hide the options menu by default", function() {
      return expect(this.widget.collector('container')).toHaveClass('cllctr-collapsed');
    });
    it("should toggle the options menu when clicking on the display", function() {
      this.widget.collector('display').click();
      expect(this.widget.collector('container')).toHaveClass('cllctr-open');
      expect(this.widget.collector('container')).not.toHaveClass('cllctr-collapsed');
      this.widget.collector('display').click();
      expect(this.widget.collector('container')).toHaveClass('cllctr-collapsed');
      return expect(this.widget.collector('container')).not.toHaveClass('cllctr-open');
    });
    it("should provide open and close methods", function() {
      this.widget.collector('open');
      expect(this.widget.collector('container')).toHaveClass('cllctr-open');
      this.widget.collector('close');
      return expect(this.widget.collector('container')).toHaveClass('cllctr-collapsed');
    });
    it("should trigger open events", function() {
      this.widget.collector('open');
      return expect(this.widget.collector('container')).toHaveClass('cllctr-open');
    });
    it("should trigger an open event when the menu opens through the method", function() {
      spyOnEvent(this.widget, 'collectoropen');
      this.widget.collector('open');
      return expect('collectoropen').toHaveBeenTriggeredOn(this.widget);
    });
    it("should trigger an open event when the menu opens by a click", function() {
      spyOnEvent(this.widget, 'collectoropen');
      this.widget.collector('display').click();
      return expect('collectoropen').toHaveBeenTriggeredOn(this.widget);
    });
    it("should trigger a close event when the menu closes through the method", function() {
      spyOnEvent(this.widget, 'collectorclose');
      this.widget.collector('close');
      return expect('collectorclose').toHaveBeenTriggeredOn(this.widget);
    });
    it("should trigger a close event when the menu closes by a click", function() {
      spyOnEvent(this.widget, 'collectorclose');
      this.widget.collector('display').click();
      this.widget.collector('display').click();
      return expect('collectorclose').toHaveBeenTriggeredOn(this.widget);
    });
    it("should close the options menu when an option is selected", function() {
      this.widget.collector('open');
      expect(this.widget.collector('container')).toHaveClass('cllctr-open');
      this.widget.collector('menu').find('li:first').click();
      return expect(this.widget.collector('container')).toHaveClass('cllctr-collapsed');
    });
    return it("should cleanup nicely put the original element back and remove the container", function() {
      this.widget.collector('destroy');
      expect(this.widget.collector('container')).not.toExist();
      return expect(this.widget).toBeVisible();
    });
  });

  describe("Collector (Removing)", function() {
    beforeEach(function() {
      this.html = '<select><option value="1">first</option><option value="2">second</option><option value="3">third</option></select>';
      return this.widget = $(this.html).appendTo($('body')).collector({
        allow_remove: true,
        remove_text: 'Get rid of this!'
      });
    });
    afterEach(function() {
      this.widget.collector('destroy');
      return this.widget.remove();
    });
    it("should add delete links to each menu item", function() {
      return expect(this.widget.collector('menu').find('li abbr.cllctr-remove').length).toEqual(3);
    });
    it("should provide a remove_text option that specifies remove link content", function() {
      return expect(this.widget.collector('menu').find('li:first abbr.cllctr-remove').text()).toEqual('Get rid of this!');
    });
    it("should trigger a remove event when a remove link is clicked", function() {
      spyOnEvent(this.widget, 'collectorremove');
      this.widget.collector('menu').find('li:first abbr.cllctr-remove').click();
      return expect('collectorremove').toHaveBeenTriggeredOn(this.widget);
    });
    it("should add the cllctr-removed class to removed items", function() {
      var li;
      li = this.widget.collector('menu').find('li:eq(1)');
      expect(li).not.toHaveClass('cllctr-removed');
      li.find('abbr.cllctr-remove').click();
      return expect(li).toHaveClass('cllctr-removed');
    });
    it("should provide easy value-based interface to manually remove options", function() {
      expect(this.widget.collector('menu').find('li:last')).not.toHaveClass('cllctr-removed');
      this.widget.collector('remove_option', '3');
      return expect(this.widget.collector('menu').find('li:last')).toHaveClass('cllctr-removed');
    });
    it("should provide easy value-based interface to unremove options", function() {
      expect(this.widget.collector('menu').find('li:last')).not.toHaveClass('cllctr-removed');
      this.widget.collector('remove_option', '3');
      expect(this.widget.collector('menu').find('li:last')).toHaveClass('cllctr-removed');
      this.widget.collector('unremove_option', '3');
      return expect(this.widget.collector('menu').find('li:last')).not.toHaveClass('cllctr-removed');
    });
    return it("shouldn't add the remove links by default", function() {
      var widget2;
      widget2 = $('<select><option value="1">first</option><option value="2">second</option><option value="3">third</option></select>').appendTo($('body')).collector();
      this.after(function() {
        widget2.collector('destroy');
        return widget2.remove();
      });
      return expect(widget2.collector('menu').find('li abbr.cllctr-remove')).not.toExist();
    });
  });

  describe("Collector (Searching)", function() {
    beforeEach(function() {
      this.choices = ['first', 'second', 'third', 'fourth', 'fifth'];
      return this.widget = $('<div id="dummy">&nbsp;</div>').appendTo($('body')).collector({
        options: this.choices,
        allow_search: true
      });
    });
    afterEach(function() {
      this.widget.collector('destroy');
      return this.widget.remove();
    });
    it("should add a search field to the widget", function() {
      return expect(this.widget.collector('searcher')).toExist();
    });
    it("should add the searcher to the container", function() {
      return expect(this.widget.collector('container')).toContain('input.cllctr-searcher');
    });
    it("should trigger a search event with the search value when there's typing in the search field", function() {
      var callback_value;
      callback_value = null;
      this.widget.bind('collectorsearch', function(event, value) {
        return callback_value = value;
      });
      this.after(function() {
        return this.widget.unbind('collectorsearch');
      });
      this.widget.collector('searcher').val('testSearch');
      this.widget.collector('searcher').keyup();
      return expect(callback_value).toEqual('testSearch');
    });
    it("should add the cllctr-filtered class to the widget container when searching for a value", function() {
      expect(this.widget.collector('container')).not.toHaveClass('cllctr-filtered');
      this.widget.collector('searcher').keyup();
      return expect(this.widget.collector('container')).toHaveClass('cllctr-filtered');
    });
    it("should provide a manual search method", function() {
      expect(this.widget.collector('container')).not.toHaveClass('cllctr-filtered');
      this.widget.collector('search', 'something');
      return expect(this.widget.collector('container')).toHaveClass('cllctr-filtered');
    });
    it("should provide an unfilter method", function() {
      this.widget.collector('search', 'filter_text');
      expect(this.widget.collector('container')).toHaveClass('cllctr-filtered');
      this.widget.collector('unfilter');
      return expect(this.widget.collector('container')).not.toHaveClass('cllctr-filtered');
    });
    it("should add a cllctr-filtered class to menu options who's label that don't match the search value", function() {
      expect(this.widget.collector('menu').find('li:eq(0)')).not.toHaveClass('cllctr-filtered');
      expect(this.widget.collector('menu').find('li:eq(1)')).not.toHaveClass('cllctr-filtered');
      expect(this.widget.collector('menu').find('li:eq(2)')).not.toHaveClass('cllctr-filtered');
      expect(this.widget.collector('menu').find('li:eq(3)')).not.toHaveClass('cllctr-filtered');
      expect(this.widget.collector('menu').find('li:eq(4)')).not.toHaveClass('cllctr-filtered');
      this.widget.collector('search', 'th');
      expect(this.widget.collector('menu').find('li:eq(0)')).toHaveClass('cllctr-filtered');
      expect(this.widget.collector('menu').find('li:eq(1)')).toHaveClass('cllctr-filtered');
      expect(this.widget.collector('menu').find('li:eq(2)')).not.toHaveClass('cllctr-filtered');
      expect(this.widget.collector('menu').find('li:eq(3)')).not.toHaveClass('cllctr-filtered');
      return expect(this.widget.collector('menu').find('li:eq(4)')).not.toHaveClass('cllctr-filtered');
    });
    it("should not render the search field by default", function() {
      var widget2;
      widget2 = $('<div id="dummy">&nbsp</div>').appendTo($('body')).collector({
        options: [
          {
            value: 1,
            label: 'one'
          }, {
            value: 2,
            label: 'two'
          }
        ]
      });
      this.after(function() {
        widget2.collector('destroy');
        return widget2.remove();
      });
      return expect(widget2.collector('searcher')).not.toExist();
    });
    it("should emphasize matched text in option labels", function() {
      this.widget.collector('search', 'our');
      return expect(this.widget.collector('menu').find('li:eq(3)').html()).toContain('f<em>our</em>th');
    });
    return it("should search capital insensitive", function() {
      this.widget.collector('search', 'FIR');
      return expect(this.widget.collector('menu').find('li:first')).not.toHaveClass('cllctr-filtered');
    });
  });

  describe("Collector (Creator)", function() {
    beforeEach(function() {
      return this.widget = $('<div id="dummy">&nbsp;</div>').appendTo($('body')).collector({
        options: ['first', 'second', 'third', 'fourth', 'fifth'],
        allow_create: true
      });
    });
    afterEach(function() {
      this.widget.collector('destroy');
      return this.widget.remove();
    });
    it("should add creator option", function() {
      return expect(this.widget.collector('creator')).toHaveClass('cllctr-creator');
    });
    it("should add the cllctr-perfect-match class to the container when a search value has a perfect match", function() {
      expect(this.widget.collector('container')).not.toHaveClass('cllctr-perfect-match');
      this.widget.collector('search', 'secon');
      expect(this.widget.collector('container')).not.toHaveClass('cllctr-perfect-match');
      this.widget.collector('search', 'second');
      return expect(this.widget.collector('container')).toHaveClass('cllctr-perfect-match');
    });
    it("should add a new option with value 'new1' when the creator option is clicked", function() {
      this.widget.collector('search', '6th');
      this.widget.collector('creator').click();
      return expect(this.widget.collector('menu').find('li[data-cllctr-value=new1]').text()).toEqual('6th');
    });
    it("should trigger a create event", function() {
      var callback_value;
      callback_value = null;
      this.widget.bind('collectorcreate', function(event, new_option) {
        return callback_value = new_option;
      });
      this.after(function() {
        return this.widget.unbind('collectorcreate');
      });
      this.widget.collector('search', 'Number Six');
      this.widget.collector('creator').click();
      expect(callback_value.value).toEqual('new1');
      return expect(callback_value.label).toEqual('Number Six');
    });
    return it("should trigger a 'new_selected' event when a newly created option was selected", function() {
      var callback_value;
      callback_value = null;
      this.widget.bind('collectorcreate', function(event, option) {
        return callback_value = option;
      });
      this.after(function() {
        return this.widget.unbind('collectornew_selected');
      });
      this.widget.collector('search', 'Add Me!');
      this.widget.collector('creator').click();
      console.log(callback_value);
      expect(callback_value.value).toEqual('new1');
      return expect(callback_value.label).toEqual('Add Me!');
    });
  });

}).call(this);
