/* global QUnit, sinon */

(function(QUnit, sinon) {
	"use strict";

	jQuery.sap.require("sap.ui.fl.variants.VariantManagement");
	jQuery.sap.require("sap.ui.fl.variants.VariantModel");
	jQuery.sap.require("sap.ui.layout.Grid");
	jQuery.sap.require("sap.m.Input");
	jQuery.sap.require("sap.ui.core.Icon");
	jQuery.sap.require("sap.ui.model.json.JSONModel");

	var oModel;

	var fGetGrid = function(oDialog) {
		var oGrid = null, aContent = oDialog.getContent();
		aContent.some(function(oContent) {
			if (oContent instanceof sap.ui.layout.Grid) {
				oGrid = oContent;
			}

			return (oGrid != null);
		});

		return oGrid;
	};

	QUnit.module("sap.ui.fl.variants.VariantManagement", {
		beforeEach: function() {
			this.oVariantManagement = new sap.ui.fl.variants.VariantManagement("One", {});

			oModel = new sap.ui.fl.variants.VariantModel({
				"One": {
					currentVariant: "Standard",
					defaultVariant: "Standard",
					originalDefaultVariant: "Standard",
					modified: false,
					variantsEditable: true,
					showFavorites: true,
					variants: [
						{
							key: "Standard",
							title: "Standard",
							author: "A",
							remove: false,
							rename: true,
							favorite: true,
							originalFavorite: true,
							visible: true,
							change: true
						}, {
							key: "1",
							title: "One",
							author: "A",
							remove: true,
							rename: true,
							favorite: true,
							originalFavorite: true,
							visible: true,
							change: true
						}, {
							key: "2",
							title: "Two",
							author: "V",
							remove: false,
							rename: true,
							favorite: true,
							originalFavorite: true,
							visible: true,
							change: true
						}, {
							key: "3",
							title: "Three",
							author: "U",
							remove: false,
							rename: true,
							favorite: true,
							originalFavorite: true,
							visible: true,
							change: true
						}, {
							key: "4",
							title: "Four",
							author: "Z",
							share: true,
							remove: false,
							rename: false,
							favorite: true,
							originalFavorite: true,
							visible: true,
							change: false
						}
					]
				}
			}, {});

			// sinon.stub(oModel,
		},
		afterEach: function() {
			this.oVariantManagement.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oVariantManagement);
	});

	QUnit.test("Shall be destroyable", function(assert) {
		assert.ok(this.oVariantManagement._oRb);
		this.oVariantManagement.destroy();

		assert.ok(!this.oVariantManagement._oRb);
	});

	QUnit.test("Check rendering", function(assert) {

		var sString = "";
		var oRm = {
			write: function(s) {
				sString += s;
			},
			writeControlData: function(oCtrl) {
			},
			addClass: function(s) {
				sString += ('class=\"' + s + '\"');
			},
			writeClasses: function() {
			},
			writeAccessibilityState: function(oCtrl, mMap) {
			},
			renderControl: function(oCtrl) {
			}
		};

		var oRenderer = this.oVariantManagement.getMetadata().getRenderer();
		assert.ok(oRenderer);
		oRenderer.render(oRm, this.oVariantManagement);
		assert.ok(sString);
	});

	QUnit.test("Check getFocusDomRef", function(assert) {

		assert.ok(this.oVariantManagement.oVariantPopoverTrigger);
		sinon.stub(this.oVariantManagement.oVariantPopoverTrigger, "getFocusDomRef");

		this.oVariantManagement.getFocusDomRef();

		assert.ok(this.oVariantManagement.oVariantPopoverTrigger.getFocusDomRef.called);
	});

	QUnit.test("Check onclick", function(assert) {

		assert.ok(this.oVariantManagement.oVariantPopoverTrigger);
		sinon.stub(this.oVariantManagement.oVariantPopoverTrigger, "focus");

		sinon.stub(this.oVariantManagement, "handleOpenCloseVariantPopover");

		this.oVariantManagement.onclick({});

		assert.ok(this.oVariantManagement.oVariantPopoverTrigger.focus.called);
		assert.ok(this.oVariantManagement.handleOpenCloseVariantPopover.called);
	});

	QUnit.test("Check onkeydown", function(assert) {

		sinon.stub(this.oVariantManagement, "_openVariantList");

		this.oVariantManagement.onkeydown({
			which: 32
		});

		assert.ok(this.oVariantManagement._openVariantList.called);
	});

	QUnit.test("Check getTitle", function(assert) {
		assert.equal(this.oVariantManagement.getTitle(), this.oVariantManagement.oVariantText);
	});

	QUnit.test("Check getVariants", function(assert) {

		var aItems = this.oVariantManagement.getVariants();
		assert.ok(aItems);
		assert.equal(aItems.length, 0);

		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);

		aItems = this.oVariantManagement.getVariants();
		assert.ok(aItems);
		assert.equal(aItems.length, 5);
		assert.equal(aItems[0].key, this.oVariantManagement.getStandardVariantKey());
		assert.equal(aItems[1].key, "1");
		assert.equal(aItems[1].visible, true);
		assert.equal(aItems[1].originalTitle, aItems[1].title);
		assert.equal(aItems[2].key, "2");

	});

	QUnit.test("Check setDefaultVariantKey", function(assert) {
		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);

		assert.equal(this.oVariantManagement.getDefaultVariantKey(), "Standard");

		this.oVariantManagement.setDefaultVariantKey("3");

		assert.equal(this.oVariantManagement.getDefaultVariantKey(), "3");
	});

	QUnit.test("Check _checkVariantNameConstraints", function(assert) {
		var oInput = new sap.m.Input();

		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);

		oInput.setValue("New");
		this.oVariantManagement._checkVariantNameConstraints(oInput, null, "1");
		assert.equal(oInput.getValueState(), "None");

		oInput.setValue("");
		this.oVariantManagement._checkVariantNameConstraints(oInput, null, "1");
		assert.equal(oInput.getValueState(), "Error");

		oInput.setValue("One");
		this.oVariantManagement._checkVariantNameConstraints(oInput, null, "1");
		assert.equal(oInput.getValueState(), "None");

		this.oVariantManagement._checkVariantNameConstraints(oInput, null, "2");
		assert.equal(oInput.getValueState(), "Error");
		oInput.destroy();
	});

	QUnit.test("Create Variants List", function(assert) {

		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);

		assert.ok(!this.oVariantManagement.oVariantPopOver);
		this.oVariantManagement._createVariantList();

		assert.ok(this.oVariantManagement.oVariantPopOver);
		sinon.stub(this.oVariantManagement.oVariantPopOver, "openBy");

		assert.equal(this.oVariantManagement.getCurrentVariantKey(), this.oVariantManagement.getStandardVariantKey());

		this.oVariantManagement._openVariantList();

		assert.ok(!this.oVariantManagement.oVariantSaveBtn.getEnabled());
		assert.ok(this.oVariantManagement.oVariantSaveAsBtn.setEnabled());

		this.oVariantManagement._openVariantList();

		assert.ok(!this.oVariantManagement.getModified());
		assert.ok(!this.oVariantManagement.oVariantSaveBtn.getEnabled());
		assert.ok(this.oVariantManagement.oVariantSaveAsBtn.setEnabled());

		this.oVariantManagement.setModified(true);
		assert.ok(this.oVariantManagement.getModified());
		assert.ok(this.oVariantManagement.oVariantSaveBtn.getEnabled());
		assert.ok(this.oVariantManagement.oVariantSaveAsBtn.setEnabled());

		oModel.updateCurrentVariant = undefined;

		this.oVariantManagement.setCurrentVariantKey("4");
		this.oVariantManagement._openVariantList();
		assert.ok(!this.oVariantManagement.oVariantSaveBtn.getEnabled());
		assert.ok(this.oVariantManagement.oVariantSaveAsBtn.setEnabled());

		this.oVariantManagement.setCurrentVariantKey("1");
		this.oVariantManagement._openVariantList();
		assert.ok(this.oVariantManagement.oVariantSaveBtn.getEnabled());
		assert.ok(this.oVariantManagement.oVariantSaveAsBtn.setEnabled());

	});

	QUnit.test("Check 'variantsEditable'", function(assert) {
		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);
		this.oVariantManagement._openVariantList();

		assert.ok(this.oVariantManagement.oVariantManageBtn.getVisible());
		assert.ok(this.oVariantManagement.oVariantSaveBtn.getVisible());
		assert.ok(this.oVariantManagement.oVariantSaveAsBtn.getVisible());
		assert.ok(this.oVariantManagement.oVariantSelectionPage.getShowFooter());

		var oData = this.oVariantManagement.getBindingContext(sap.ui.fl.variants.VariantManagement.MODEL_NAME).getObject();
		oData.variantsEditable = !oData.variantsEditable;

		oModel.checkUpdate(true);

		assert.ok(!this.oVariantManagement.oVariantManageBtn.getVisible());
		assert.ok(!this.oVariantManagement.oVariantSaveBtn.getVisible());
		assert.ok(!this.oVariantManagement.oVariantSaveAsBtn.getVisible());
		assert.ok(!this.oVariantManagement.oVariantSelectionPage.getShowFooter());
	});

	QUnit.test("Create SaveAs Dialog", function(assert) {

		assert.ok(!this.oVariantManagement.oSaveAsDialog);
		this.oVariantManagement._createSaveAsDialog();

		assert.ok(this.oVariantManagement.oSaveAsDialog);
		sinon.stub(this.oVariantManagement.oSaveAsDialog, "open");

		this.oVariantManagement._openSaveAsDialog();

		assert.ok(this.oVariantManagement.oInputName.getVisible());
		assert.ok(!this.oVariantManagement.oLabelKey.getVisible());
		assert.ok(!this.oVariantManagement.oInputManualKey.getVisible());

		var oGrid = fGetGrid(this.oVariantManagement.oSaveAsDialog);
		var oGridContent = oGrid.getContent();
		assert.ok(oGridContent);
		assert.equal(oGridContent.length, 1);

		this.oVariantManagement.oSaveAsDialog.destroy();
		this.oVariantManagement.oSaveAsDialog = undefined;
		this.oVariantManagement.oShare.destroy();
		this.oVariantManagement.oExecuteOnSelect.destroy();

		this.oVariantManagement.setShowExecuteOnSelection(true);
		this.oVariantManagement.setShowShare(true);
		this.oVariantManagement._createSaveAsDialog();

		assert.ok(this.oVariantManagement.oSaveAsDialog);
		sinon.stub(this.oVariantManagement.oSaveAsDialog, "open");

		this.oVariantManagement._openSaveAsDialog();
		oGrid = fGetGrid(this.oVariantManagement.oSaveAsDialog);
		oGridContent = oGrid.getContent();
		assert.ok(oGridContent);
		assert.equal(oGridContent.length, 3);

		assert.ok(!this.oVariantManagement.getManualVariantKey());
		assert.ok(!this.oVariantManagement.oInputManualKey.getVisible());
		assert.ok(!this.oVariantManagement.oLabelKey.getVisible());

		this.oVariantManagement.setManualVariantKey(true);
		this.oVariantManagement._openSaveAsDialog();

		assert.ok(this.oVariantManagement.oInputManualKey.getVisible());
		assert.ok(this.oVariantManagement.oLabelKey.getVisible());
	});

	QUnit.test("Checking _handleVariantSaveAs", function(assert) {

		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);

		var bCalled = false;
		this.oVariantManagement.attachSave(function(oEvent) {
			bCalled = true;
		});

		this.oVariantManagement._createSaveAsDialog();

		assert.ok(this.oVariantManagement.oSaveAsDialog);
		sinon.stub(this.oVariantManagement.oSaveAsDialog, "open");

		this.oVariantManagement._openSaveAsDialog();

		var aItems = this.oVariantManagement._getItems();
		assert.ok(aItems);
		assert.equal(aItems.length, 5);

		this.oVariantManagement._handleVariantSaveAs("1");
		assert.ok(bCalled);
		assert.equal(this.oVariantManagement.oInputName.getValueState(), "None");

		this.oVariantManagement._handleVariantSaveAs(" ");
		assert.equal(this.oVariantManagement.oInputName.getValueState(), "Error");

		this.oVariantManagement.setManualVariantKey(true);
		this.oVariantManagement._handleVariantSaveAs("1");
		assert.equal(this.oVariantManagement.oInputManualKey.getValueState(), "Error");

	});

	QUnit.test("Checking _handleVariantSave", function(assert) {

		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);
		oModel.updateCurrentVariant = undefined;

		var bCalled = false;
		this.oVariantManagement.attachSave(function(oEvent) {
			bCalled = true;
		});

		this.oVariantManagement._createSaveAsDialog();

		assert.ok(this.oVariantManagement.oSaveAsDialog);
		sinon.stub(this.oVariantManagement.oSaveAsDialog, "open");

		sinon.stub(oModel, "_switchToVariant").returns(Promise.resolve());
		this.oVariantManagement.setCurrentVariantKey("1");

		this.oVariantManagement._openSaveAsDialog();

		this.oVariantManagement._handleVariantSave();
		assert.ok(bCalled);
	});

	QUnit.test("Checking _handleVariantSave on shared variant", function(assert) {

		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);
		oModel.updateCurrentVariant = undefined;

		var bCalled = false;
		this.oVariantManagement.attachSave(function(oEvent) {
			bCalled = true;
		});

		this.oVariantManagement._createSaveAsDialog();

		assert.ok(this.oVariantManagement.oSaveAsDialog);
		sinon.stub(this.oVariantManagement.oSaveAsDialog, "open");

		// sinon.stub(oModel, "_switchToVariant").returns(Promise.resolve());
		this.oVariantManagement.setCurrentVariantKey("4");

		this.oVariantManagement._assignTransport = function(oItem, fOK, fError) {
			fOK("package", "transport");
		};

		assert.ok(!this.oVariantManagement.sPackage);
		assert.ok(!this.oVariantManagement.sTransport);

		this.oVariantManagement._handleVariantSave();
		assert.ok(bCalled);

		assert.equal(this.oVariantManagement.sPackage, "package");
		assert.equal(this.oVariantManagement.sTransport, "transport");

	});

	QUnit.test("Checking openManagementDialog", function(assert) {
		var bDestroy = false;
		this.oVariantManagement.oManagementDialog = {
			destroy: function() {
				bDestroy = true;
			}
		};

		sinon.stub(this.oVariantManagement, "_openManagementDialog");

		this.oVariantManagement.openManagementDialog();
		assert.ok(this.oVariantManagement._openManagementDialog.calledOnce);
		assert.ok(!bDestroy);

		this.oVariantManagement.openManagementDialog(true);
		assert.ok(this.oVariantManagement._openManagementDialog.calledTwice);
		assert.ok(bDestroy);
		assert.equal(this.oVariantManagement.oManagementDialog, undefined);

	});

	QUnit.test("Checking create management dialog", function(assert) {

		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);

		this.oVariantManagement._createManagementDialog();
		assert.ok(this.oVariantManagement.oManagementDialog);
		sinon.stub(this.oVariantManagement.oManagementDialog, "open");

		this.oVariantManagement._openManagementDialog();
		assert.ok(this.oVariantManagement.oManagementTable);
		var aRows = this.oVariantManagement.oManagementTable.getItems();
		assert.ok(aRows);
		assert.equal(aRows.length, 5);

	});

	QUnit.test("Checking _handleManageDefaultVariantChange", function(assert) {

		var bEnabled = false;
		sinon.stub(this.oVariantManagement, "_anyInErrorState").returns(false);

		this.oVariantManagement.oManagementSave = {
			setEnabled: function(bFlag) {
				bEnabled = true;
			}
		};

		this.oVariantManagement._handleManageDefaultVariantChange(null, "1");
		assert.ok(bEnabled);

		this.oVariantManagement._anyInErrorState.restore();
		sinon.stub(this.oVariantManagement, "_anyInErrorState").returns(true);
		bEnabled = false;
		this.oVariantManagement._handleManageDefaultVariantChange(null, "1");
		assert.ok(!bEnabled);

		this.oVariantManagement.oManagementSave = undefined;
	});

	QUnit.test("Checking _handleManageCancelPressed", function(assert) {

		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);

		var oItemDel = this.oVariantManagement._getItemByKey("1");
		var oItemRen = this.oVariantManagement._getItemByKey("3");

		var aItems = this.oVariantManagement._getItems();
		assert.ok(aItems);
		assert.equal(aItems.length, 5);

		oItemDel.visible = false;
		oItemRen.title = "Not Three";

		this.oVariantManagement._createManagementDialog();
		assert.ok(this.oVariantManagement.oManagementDialog);
		sinon.stub(this.oVariantManagement.oManagementDialog, "open");

		this.oVariantManagement._openManagementDialog();
		var aRows = this.oVariantManagement.oManagementTable.getItems();
		assert.ok(aRows);
		assert.equal(aRows.length, 4);

		this.oVariantManagement._handleManageCancelPressed();

		this.oVariantManagement._openManagementDialog();
		aRows = this.oVariantManagement.oManagementTable.getItems();
		assert.ok(aRows);
		assert.equal(aRows.length, 5);

		var oItem = this.oVariantManagement._getItemByKey("3");
		assert.ok(oItem);
		assert.equal(oItem.title, "Three");
		assert.equal(oItem.originalTitle, oItem.title);

	});

	QUnit.test("Checking _handleManageSavePressed; deleted item is NOT selected", function(assert) {

		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);

		this.oVariantManagement.attachManage(function(oEvent) {
			var aDelItems = [], aRenamedItems = [];
			var oData = this.oVariantManagement.getBindingContext("$FlexVariants").getObject();

			oData["variants"].forEach(function(oItem) {
				if (!oItem.visible) {
					aDelItems.push(oItem.key);
				} else if (oItem.title !== oItem.originalTitle) {
					aRenamedItems.push(oItem.key);
				}
			});

			assert.ok(aDelItems);
			assert.equal(aDelItems.length, 2);
			assert.equal(aDelItems[0], "1");
			assert.equal(aDelItems[1], "4");

			assert.ok(aRenamedItems);
			assert.equal(aRenamedItems.length, 1);
			assert.equal(aRenamedItems[0], "3");
			assert.equal(oData["variants"][aRenamedItems[0]].title, "New 3");
		}.bind(this));

		this.oVariantManagement._createManagementDialog();
		assert.ok(this.oVariantManagement.oManagementDialog);
		sinon.stub(this.oVariantManagement.oManagementDialog, "open");

		var oItemRen = this.oVariantManagement._getItemByKey("3");
		assert.ok(oItemRen);
		oItemRen.title = "New 3";
		this.oVariantManagement._handleManageTitleChanged(oItemRen);

		var oItemDel = this.oVariantManagement._getItemByKey("1");
		assert.ok(oItemDel);

		oItemDel.title = "New 1";
		this.oVariantManagement._handleManageTitleChanged(oItemDel);

		this.oVariantManagement._handleManageDeletePressed(oItemDel);
		this.oVariantManagement._handleManageDeletePressed(this.oVariantManagement._getItemByKey("4"));

		this.oVariantManagement._handleManageSavePressed();

		assert.ok(!this.oVariantManagement.bFireSelect);

	});

	QUnit.test("Checking _handleManageSavePressed; deleted item is selected", function(assert) {

		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);

		this.oVariantManagement.attachManage(function(oEvent) {

			var aDelItems = [], aRenamedItems = [], aFavItems = [];

			var oData = this.oVariantManagement.getBindingContext("$FlexVariants").getObject();

			oData["variants"].forEach(function(oItem) {
				if (!oItem.visible) {
					aDelItems.push(oItem.key);
				} else {
					if (oItem.title !== oItem.originalTitle) {
						aRenamedItems.push(oItem.key);
					}
					if (oItem.favorite !== oItem.originalFavorite) {
						aFavItems.push(oItem.key);
					}
				}
			});

			assert.ok(aDelItems);
			assert.equal(aDelItems.length, 2);
			assert.equal(aDelItems[0], "1");
			assert.equal(aDelItems[1], "2");

			assert.ok(aRenamedItems);
			assert.equal(aRenamedItems.length, 1);
			assert.equal(aRenamedItems[0], "3");
			assert.equal(oData["variants"][aRenamedItems[0]].title, "New 3");

			assert.ok(aFavItems);
			assert.equal(aFavItems.length, 1);
			assert.equal(aFavItems[0], "4");
			assert.ok(!oData["variants"][aFavItems[0]].favorite);
		}.bind(this));

		this.oVariantManagement._createManagementDialog();
		assert.ok(this.oVariantManagement.oManagementDialog);
		sinon.stub(this.oVariantManagement.oManagementDialog, "open");

		var oItemRen = this.oVariantManagement._getItemByKey("3");
		assert.ok(oItemRen);
		oItemRen.title = "New 3";
		this.oVariantManagement._handleManageTitleChanged(oItemRen);

		var oItemDel = this.oVariantManagement._getItemByKey("1");
		assert.ok(oItemDel);

		oItemDel.title = "New 1";
		this.oVariantManagement._handleManageTitleChanged(oItemDel);

		this.oVariantManagement._handleManageDeletePressed(oItemDel);
		this.oVariantManagement._handleManageDeletePressed(this.oVariantManagement._getItemByKey("2"));

		var oItemFav = this.oVariantManagement._getItemByKey("4");
		assert.ok(oItemFav);
		this.oVariantManagement._handleManageFavoriteChanged(null, oItemFav);

		sinon.stub(oModel, "_switchToVariant").returns(Promise.resolve());
		this.oVariantManagement.setCurrentVariantKey("1");

		this.oVariantManagement._handleManageSavePressed();

		assert.equal(this.oVariantManagement.getCurrentVariantKey(), this.oVariantManagement.getStandardVariantKey());

	});

	QUnit.test("Checking _triggerSearch", function(assert) {
		var oEvent = {
			params: {
				newValue: "e"
			},
			getParameters: function() {
				return this.params;
			}
		};

		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);
		this.oVariantManagement._createVariantList();
		var aItems = this.oVariantManagement._oVariantList.getItems();
		assert.ok(aItems);
		assert.equal(aItems.length, 5);

		sinon.spy(this.oVariantManagement._oVariantList, "getBinding");

		this.oVariantManagement._triggerSearch(null, this.oVariantManagement._oVariantList);
		assert.ok(!this.oVariantManagement._oVariantList.getBinding.called);

		this.oVariantManagement._triggerSearch({
			getParameters: function() {
				return null;
			}
		}, this.oVariantManagement._oVariantList);
		assert.ok(!this.oVariantManagement._oVariantList.getBinding.called);

		this.oVariantManagement._triggerSearch(oEvent, this.oVariantManagement._oVariantList);
		assert.ok(this.oVariantManagement._oVariantList.getBinding.called);
		aItems = this.oVariantManagement._oVariantList.getItems();
		assert.ok(aItems);
		assert.equal(aItems.length, 2);

	});

	QUnit.test("Checking _setFavoriteIcon", function(assert) {
		var oIcon = new sap.ui.core.Icon();

		this.oVariantManagement._setFavoriteIcon(oIcon, true);
		assert.equal(oIcon.getSrc(), "sap-icon://favorite");

		this.oVariantManagement._setFavoriteIcon(oIcon, false);
		assert.equal(oIcon.getSrc(), "sap-icon://unfavorite");

	});

	QUnit.test("Checking _assignTransport", function(assert) {
		var oEvent = {
			params: {
				selectedPackage: "package",
				selectedTransport: "transport"

			},
			getParameters: function() {
				return this.params;
			}
		};

		var fStub = function(obj, fOk, fError, bCompact) {
			fOk(oEvent);
		};

		sinon.stub(this.oVariantManagement, "_selectTransport", fStub);

		var sPackage, sTransport, oErrorResult = null;

		var oItem = {
			key: "1",
			lifecyclePackage: "package0",
			lifecycleTransportId: "transport0",
			namespace: "ns"
		};
		var fOK = function(sPak, sTrans) {
			sPackage = sPak;
			sTransport = sTrans;
		};
		var fError = function(oObj) {
			oErrorResult = oObj;
		};

		this.oVariantManagement._assignTransport(oItem, fOK, fError);
		assert.equal(sPackage, "package0");
		assert.equal(sTransport, "transport0");

		this.oVariantManagement._assignTransport(null, fOK, fError);
		assert.equal(sPackage, "package");
		assert.equal(sTransport, "transport");
		assert.ok(!oErrorResult); // not yet tested

	});

	QUnit.test("Checking _handleShareSelected", function(assert) {
		var oEvent = {
			params: {
				selected: true,
				selectedPackage: "package",
				selectedTransport: "transport"
			},
			getParameters: function() {
				return this.params;
			}
		};

		var fStub = function(obj, fOk, fError) {
			fOk(oEvent);
		};

		sinon.stub(this.oVariantManagement, "_selectTransport", fStub);
		this.oVariantManagement._handleShareSelected(oEvent);
		assert.equal(this.oVariantManagement.sPackage, "package");
		assert.equal(this.oVariantManagement.sTransport, "transport");

	});

	QUnit.test("Checking handleOpenCloseVariantPopover ", function(assert) {

		var bListClosed = false, bErrorListClosed = false;

		sinon.stub(this.oVariantManagement, "_openVariantList");

		this.oVariantManagement.bPopoverOpen = true;
		this.oVariantManagement.handleOpenCloseVariantPopover();
		assert.ok(!this.oVariantManagement._openVariantList.called);

		this.oVariantManagement.bPopoverOpen = false;
		this.oVariantManagement.handleOpenCloseVariantPopover();
		assert.ok(this.oVariantManagement._openVariantList.calledOnce);

		// -
		this.oVariantManagement._openVariantList.restore();
		sinon.stub(this.oVariantManagement, "_openVariantList");

		this.oVariantManagement.oVariantPopOver = {
			isOpen: function() {
				return true;
			},
			close: function() {
				bListClosed = true;
			}
		};
		this.oVariantManagement.bPopoverOpen = true;

		this.oVariantManagement.handleOpenCloseVariantPopover();
		assert.ok(!this.oVariantManagement._openVariantList.called);
		assert.ok(bListClosed);
		assert.ok(!bErrorListClosed);

		// --
		bListClosed = false;
		this.oVariantManagement.oVariantPopOver = null;
		this.oVariantManagement.oErrorVariantPopOver = {
			isOpen: function() {
				return true;
			},
			close: function() {
				bErrorListClosed = true;
			}
		};
		this.oVariantManagement.handleOpenCloseVariantPopover();
		assert.ok(!this.oVariantManagement._openVariantList.called);
		assert.ok(!bListClosed);
		assert.ok(!bErrorListClosed);

		// -
		this.oVariantManagement.setInErrorState(true);
		this.oVariantManagement.handleOpenCloseVariantPopover();
		assert.ok(!this.oVariantManagement._openVariantList.called);
		assert.ok(!bListClosed);
		assert.ok(bErrorListClosed);

	});

	QUnit.test("Checking _openVariantList in errorState", function(assert) {

		this.oVariantManagement.setInErrorState(true);
		assert.ok(!this.oVariantManagement.oErrorVariantPopOver);
		this.oVariantManagement._openVariantList();
		assert.ok(this.oVariantManagement.oErrorVariantPopOver);

		this.oVariantManagement.oErrorVariantPopOver.destroy();
		this.oVariantManagement.oErrorVariantPopOver = null;
	});

	QUnit.test("Checking _openInErrorState", function(assert) {

		assert.ok(!this.oVariantManagement.oErrorVariantPopOver);
		this.oVariantManagement._openInErrorState();
		assert.ok(this.oVariantManagement.oErrorVariantPopOver);

		this.oVariantManagement.oErrorVariantPopOver.destroy();
		this.oVariantManagement.oErrorVariantPopOver = null;
	});

	QUnit.test("Checking _triggerSearchInManageDialog", function(assert) {

		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);

		assert.ok(!this.oVariantManagement._bDeleteOccured);

		this.oVariantManagement._createManagementDialog();
		this.oVariantManagement._triggerSearchInManageDialog(null, this.oVariantManagement.oManagementTable);
		assert.ok(!this.oVariantManagement._bDeleteOccured);

		var oEvent = {
			getParameters: function() {
				return null;
			}
		};
		this.oVariantManagement._triggerSearchInManageDialog(oEvent, this.oVariantManagement.oManagementTable);
		assert.ok(!this.oVariantManagement._bDeleteOccured);

		sinon.stub(oEvent, "getParameters").returns({});

		this.oVariantManagement._triggerSearchInManageDialog(oEvent, this.oVariantManagement.oManagementTable);
		assert.ok(this.oVariantManagement._bDeleteOccured);

	});

	QUnit.test("Checking _handleManageExecuteOnSelectionChanged ", function(assert) {
		this.oVariantManagement.setModel(oModel, sap.ui.fl.variants.VariantManagement.MODEL_NAME);
		this.oVariantManagement._createManagementDialog();

		this.oVariantManagement._handleManageExecuteOnSelectionChanged({});
		assert.ok(this.oVariantManagement.oManagementSave.getEnabled());
	});

}(QUnit, sinon));
