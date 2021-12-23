using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TsMolymerWebApp.Models;

namespace TsMolymerWebApp.Controllers
{
    public class BOMController : Controller
    {

        TSMolymer_FEntities db = new TSMolymer_FEntities();

        // GET: BOM
        public ActionResult BOMMain()
        {
            try
            {
                Result result = GetRefNoData();
                if (result.success)
                {
                    ViewBag.TableRefNoDatas = result.data;
                }
                
            }
            catch (Exception ex)
            {
                ViewBag.MasterReferenceNoes = null;
            }
            return View();

           /* try
            {
                Result result = GetRefNoOverviewData(long refID);
                if (result.sucess)
                {
                    ViewBag.ProcessDetails = result.data;
                }
            }
            catch (Exception ex)
            { 
                ViewBag.MasterReferenceNoes = null;

            }

           return View();*/
        }



        #region BOM

        // Test Function P'Fluke Dont delete
        public ActionResult TestData(long? refID)
        {
            Result result = GetRefNoOverviewData(refID??0);
            

            return Json(result, JsonRequestBehavior.AllowGet);
        }



        #region General

        private Result GetRefNoData()
        {
            Result result = new Result();
            List<TableRefNoData> tableRefNoDatas = new List<TableRefNoData>();
            try
            {
                db = new TSMolymer_FEntities();
                List<MasterReferenceNo> masterReferenceNos = db.MasterReferenceNoes.ToList();
                
                if (masterReferenceNos.Count > 0)
                {
                    foreach(MasterReferenceNo mRefNo in masterReferenceNos)
                    {
                        TableRefNoData tableRefNo = new TableRefNoData();
                        tableRefNo.RefID = mRefNo.RefID;
                        tableRefNo.RefNo = mRefNo.RefNo;

                        List<long> PartIDs = mRefNo.PartReferentNoHistories.Where(x => x.RefID == mRefNo.RefID).Select(x => x.PartID ?? 0).ToList();

                        List<MasterPart> mParts = db.MasterParts.Where(x => PartIDs.Contains(x.PartID)).ToList();

                        string partCode = "";
                        string partName = "";
                        string axPartNo = "";
                        foreach(MasterPart mp in mParts)
                        {
                            partCode += mp.PartCode + ", ";
                            partName += mp.PartName + ", ";
                            axPartNo += mp.AxPartNo + ", ";
                        }

                        if (partCode.Length > 2) partCode.Substring(0, partCode.Length - 2);
                        if (partName.Length > 2) partName.Substring(0, partName.Length - 2);
                        if (axPartNo.Length > 2) axPartNo.Substring(0, axPartNo.Length - 2);


                        tableRefNo.PartCode = partCode;
                        tableRefNo.PartName = partName;
                        tableRefNo.Customer = mRefNo.Customer;
                        tableRefNo.Model = mRefNo.Model;
                        tableRefNo.AXPartNo = axPartNo;
                        tableRefNo.Status = mRefNo.Status;
                        tableRefNo.IssueDate = mRefNo.IssueDate;
                        tableRefNo.Remark = mRefNo.Remark;
                        tableRefNo.Description = mRefNo.Description;

                        tableRefNoDatas.Add(tableRefNo);
                    }
                }
                result.success = true;
                result.data = tableRefNoDatas;
            }
            catch(Exception ex)
            {
                result.success = false;
                result.data = ex;
                result.errorMsg = ex.Message;
            }

            return result;
        }

        private Result GetRefNoOverviewData(long refID)
        {
            Result result = new Result();
            db = new TSMolymer_FEntities();
            MasterReferenceNo mRef = db.MasterReferenceNoes.Where(x => x.RefID == refID).FirstOrDefault();
            if (mRef == null)
            {
                result.success = false;
                result.data = "mRef hs no data";
                result.errorMsg = "mRef hs no data";
                return result;
            }
            List<ProcessDetail> processDetails = new List<ProcessDetail>();

            try
            {
                if (mRef.ProcessInjections.Count > 0)
                {
                    foreach (ProcessInjection pInject in mRef.ProcessInjections)
                    {
                        if (pInject.InsertMold ?? false)
                        {
                            string mat = "NaN";
                            if (pInject.InjectionMaterials.Count > 0)
                            {
                                mat = "";
                                foreach (InjectionMaterial material in pInject.InjectionMaterials)
                                {
                                    mat += material.MasterInjectionMaterial.Code + " , ";
                                }
                                mat = mat.Substring(0, mat.Length - 3);
                            }

                            ProcessDetail detail = new ProcessDetail();
                            detail.Process = "Insert Mold";
                            detail.ProcessID = "Ins_" + pInject.InjectionID.ToString();
                            detail.ProcessIndex = pInject.ProcessIndex ?? 1;
                            detail.Detail = "Material : " + mat;
                            processDetails.Add(detail);
                        }
                        else
                        {
                            string mat = "NaN";
                            if (pInject.InjectionMaterials.Count > 0)
                            {
                                mat = "";
                                foreach (InjectionMaterial material in pInject.InjectionMaterials)
                                {
                                    mat += material.MasterInjectionMaterial.Code + " , ";
                                }
                                mat = mat.Substring(0, mat.Length - 3);
                            }

                            ProcessDetail detail = new ProcessDetail();
                            detail.Process = "Injection";
                            detail.ProcessID = "Inj_" + pInject.InjectionID.ToString();
                            detail.ProcessIndex = pInject.ProcessIndex ?? 1;
                            detail.Detail = "Material : " + mat;
                            processDetails.Add(detail);
                        }

                        //db.SaveChanges();
                    }

                }
                if (mRef.ProcessPrintings.Count > 0)
                {
                    foreach (ProcessPrinting pPrinting in mRef.ProcessPrintings)
                    {
                        string colorName;
                        if (pPrinting.MasterColorMaterial == null)
                        {
                            colorName = "NaN";
                        }
                        else
                        {
                            colorName = pPrinting.MasterColorMaterial.ColorName;
                        }

                        string text = "MFG : " + (pPrinting.MFG ?? "NaN") + ", Color : " + colorName + ", Pcs/Hr : " + (pPrinting.PcsHr ?? 0);
                        ProcessDetail detail = new ProcessDetail();
                        detail.Process = "Printing";
                        detail.ProcessID = "Prt_" + pPrinting.PrintingID.ToString();
                        detail.ProcessIndex = pPrinting.ProcessIndex ?? 1;
                        detail.Detail = text;
                        processDetails.Add(detail);
                        //db.SaveChanges();
                    }

                }
                if (mRef.ProcessSprays.Count > 0)
                {
                    foreach (ProcessSpray pSpray in mRef.ProcessSprays)
                    {
                        string colorName = "NaN";
                        if (pSpray.MasterColorMaterial != null)
                        {
                            colorName = pSpray.MasterColorMaterial.ColorName ?? "NaN";
                        }


                        string text = "MFG : " + (pSpray.MFG ?? "NaN") + ", Color : " + colorName + ", Pcs/Hr : " + (pSpray.PcsHr ?? 0);
                        ProcessDetail detail = new ProcessDetail();
                        detail.Process = "Spray";
                        detail.ProcessID = "Spr_" + pSpray.SprayID.ToString();
                        detail.ProcessIndex = pSpray.ProcessIndex ?? 1;
                        detail.Detail = text;
                        processDetails.Add(detail);
                        //db.SaveChanges();
                    }

                }
                if (mRef.ProcessAssemblies.Count > 0)
                {
                    foreach (ProcessAssembly pAssy in mRef.ProcessAssemblies)
                    {
                        string colorName;
                        //if (pAssy.MasterColorMaterial == null)
                        //{
                        //    colorName = "NaN";
                        //}
                        //else
                        //{
                        //    colorName = pPrinting.MasterColorMaterial.ColorName;
                        //}

                        string text = "Process Name : " + (pAssy.ProcessName ?? " ");
                        ProcessDetail detail = new ProcessDetail();
                        detail.Process = "Assembly";
                        detail.ProcessID = "Assy_" + pAssy.AssyProcID.ToString();
                        detail.ProcessIndex = pAssy.ProcessIndex ?? 1;
                        detail.Detail = text;
                        processDetails.Add(detail);
                        //db.SaveChanges();
                    }
                }
                if (mRef.ProcessWeldings.Count > 0)
                {
                    foreach (ProcessWelding pWeld in mRef.ProcessWeldings)
                    {
                        string part = "NaN";
                        if (pWeld.WeldingComponentParts.Count > 0)
                        {
                            part = "";
                            foreach (WeldingComponentPart p in pWeld.WeldingComponentParts.Where(x => x.PartID != null))
                            {
                                part += p.MasterPart.PartCode + " + ";
                            }
                            part = part.Substring(0, part.Length - 2);
                        }

                        string text = "Part : " + part;
                        ProcessDetail detail = new ProcessDetail();
                        detail.Process = "Welding";
                        detail.ProcessID = "Weld_" + pWeld.WeldingID.ToString();
                        detail.ProcessIndex = pWeld.ProcessIndex ?? 1;
                        detail.Detail = text;
                        processDetails.Add(detail);
                        //db.SaveChanges();
                    }
                }
                if (mRef.ProcessHotStamps.Count > 0)
                {
                    foreach (ProcessHotStamp pHots in mRef.ProcessHotStamps)
                    {
                        string code;
                        if (pHots.MasterHotStampMaterial == null)
                        {
                            code = "NaN";
                        }
                        else
                        {
                            code = pHots.MasterHotStampMaterial.FoilCode;
                        }

                        string text = "Code : " + code + ", Foil Size : " + (pHots.FoilSize ?? "NaN");
                        ProcessDetail detail = new ProcessDetail();
                        detail.Process = "Hot Stamp";
                        detail.ProcessID = "Hots_" + pHots.HSID.ToString();
                        detail.ProcessIndex = pHots.ProcessIndex ?? 1;
                        detail.Detail = text;
                        processDetails.Add(detail);
                        //db.SaveChanges();
                    }
                }

                List<ProcessDetail> processDetails1 = processDetails.OrderBy(x => x.ProcessIndex).ToList();

                result.success = true;
                result.data = processDetails1;
            }
            catch(Exception ex)
            {
                result.success = false;
                result.data = ex;
                result.errorMsg = ex.Message;
            }

            return result;

        }


        #endregion

        public ActionResult AddRef(string modalRefNo, string modalModel, string modalCustomer, string modalDescription, string modalRemark, string modalRefID,string modalIssueDate)
        {
            long refID = 0;
            if (!Int64.TryParse(modalRefID, out refID))
            {
                refID = 0;
            }
            if (refID == 0) 
            {
                try
                {
                    db = new TSMolymer_FEntities();


                    MasterReferenceNo isDup = db.MasterReferenceNoes.Where(x => x.RefNo == modalRefNo).FirstOrDefault();
                    if (isDup != null)
                    {
                        
                        return Json(new { success = false, comment = "Duplicate ref.no code" }, JsonRequestBehavior.AllowGet);
                    }


                    MasterReferenceNo macData = new MasterReferenceNo();
                    macData.RefNo = modalRefNo;
                    macData.Model = modalModel;
                    macData.Customer = modalCustomer;
                    macData.Description = modalDescription;
                    macData.Remark = modalRemark;
                    /*macData.IssueDate = modalIssueDate ;*/

                    try
                    {
                        db.Entry(macData).State = System.Data.Entity.EntityState.Added;
                        db.SaveChanges();
                        TempData["bomMainAddEditCmt"] = "Add ref success";
                        return RedirectToAction("BOMMain");
                        //return Json(new { success = true }, JsonRequestBehavior.AllowGet);
                    }
                    catch (Exception ab)
                    {
                        return Json(new { success = false, comment = "Add failed.\n" + ab.Message }, JsonRequestBehavior.AllowGet);
                    }
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, comment = "Add failed.\n" + ex.Message }, JsonRequestBehavior.AllowGet);
                }
            }
            else // Edit part
            {

                try
                {
                    MasterReferenceNo isDup = db.MasterReferenceNoes.Where(x => x.RefNo == modalRefNo).FirstOrDefault();
                    if (isDup != null)
                    {
                        // same partCode
                        return Json(new { success = false, comment = "Duplicate ref.no code" }, JsonRequestBehavior.AllowGet);
                    }


                    MasterReferenceNo macData = new MasterReferenceNo();
                    macData.RefNo = modalRefNo;
                    macData.Model = modalModel;
                    macData.Customer = modalCustomer;
                    macData.Description = modalDescription;
                    macData.Remark = modalRemark;
                    /*macData.IssueDate = modalIssueDate;*/
                    try
                    {
                        db.Entry(macData).State = System.Data.Entity.EntityState.Modified;
                        db.SaveChanges();
                        TempData["bomMainAddEditCmt"] = "Edit ref success";
                        return RedirectToAction("BOMMain");
                        //return Json(new { success = true }, JsonRequestBehavior.AllowGet);
                    }
                    catch (Exception ab)
                    {
                        return Json(new { success = false, comment = "Edit failed.\n" + ab.Message }, JsonRequestBehavior.AllowGet);
                    }
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, comment = "Edit failed.\n" + ex.Message }, JsonRequestBehavior.AllowGet);
                }
            }

        }
        public ActionResult DeleteBOMRef(string _ID)
        {
            Result result = new Result();
            try
            {
                long refId = Convert.ToInt64(_ID);
                db = new TSMolymer_FEntities();
                MasterReferenceNo data = new MasterReferenceNo();
                data = db.MasterReferenceNoes.Where(o => o.RefID == refId).FirstOrDefault();
                if (data != null)
                {
                    try
                    {
                        db.Entry(data).State = System.Data.Entity.EntityState.Deleted;
                        db.SaveChanges();
                        result.success = true;
                        result.data = "MasterReferenceNo";
                    }
                    catch (Exception ex)
                    {
                        string error = "Delete Ref failed.\n" + ex.Message;
                        result.errorMsg = error;
                        result.success = false;
                    }
                }
                else
                {
                    string error = "No Ref data.";
                    result.errorMsg = error;
                    result.success = false;
                }
            }
            catch (Exception ex)
            {
                string error = "Delete Ref data failed.";
                result.errorMsg = error;
                result.success = false;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetTableMoldDataByRefID(string id)
        {
            Result result = new Result();
            db = new TSMolymer_FEntities();
            try
            {
                long refID = 0;
                if (!long.TryParse(id, out refID))
                {
                    result.success = false;
                    result.data = "ref id can not parse to number";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }

                MasterReferenceNo masterReferenceNo = db.MasterReferenceNoes.Where(x => x.RefID == refID).FirstOrDefault();
                if(masterReferenceNo == null)
                {
                    result.success = false;
                    result.data = "Reference No. is not found";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }

                List<long> injectionIDs = db.ProcessInjections.Where(x => x.RefID == refID).Select(x=>x.InjectionID).ToList();

                if(injectionIDs.Count <= 0)
                {
                    result.success = true;
                    result.data = "0";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }

                List<long> MoldIDs = db.InjectionMolds.Where(x => injectionIDs.Contains(x.InjectionID) && x.MoldID != null).Select(x => x.MoldID ?? 0).ToList();

                List<MasterMold> masterMolds = db.MasterMolds.Where(x => MoldIDs.Contains(x.MoldID)).ToList();
                if (masterMolds.Count == 0)
                {
                    result.success = true;
                    result.data = "0";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                List<TableMoldData> tableMolds = new List<TableMoldData>();

                foreach(MasterMold masterMold in masterMolds)
                {
                    TableMoldData tableMold = new TableMoldData()
                    {
                        BasicMold = masterMold.BasicMold,
                        DieNo = masterMold.DieNo,
                        AXMoldNo = masterMold.AXMoldNo

                    };

                    if (masterMold.MoldMachines.Count > 0)
                    {
                        List<string> mcNames = masterMold.MoldMachines.Select(x => x.MasterMachine.MachineNo).ToList();
                        string approveMc = "";

                        foreach (string name in mcNames)
                        {
                            approveMc += name + "/";
                        }
                        tableMold.ApproveMcName = approveMc.Substring(0, approveMc.Length - 1);
                    }

                    if (masterMold.MoldJigs.Count > 0)
                    {
                        List<string> jigNos = masterMold.MoldJigs.Select(x => x.JigNo).ToList();
                        string jig = "";

                        foreach (string no in jigNos)
                        {
                            jig += no + "/";
                        }
                        tableMold.JigNo = jig.Substring(0, jig.Length - 1);
                    }

                    tableMolds.Add(tableMold);
                }
               

                



                result.success = true;
                result.data = tableMolds;

            }
            catch (Exception ex)
            {
                result.success = false;
                result.data = ex;
                result.errorMsg = ex.Message;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        #endregion

        /*public ActionResult GetHotStampJig()
        {
            Result result = new Result();
            try
            {
                db = new TSMolymer_FEntities();

                List<HotStampJig> hotStampJigs = db.HotStampJigs.ToList();
                foreach (HotStampJig m in hotStampJigs)
                {
                    db.Entry(m).State = System.Data.Entity.EntityState.Detached;
                }
                result.data = hotStampJigs;
                result.success = true;

            }
            catch (Exception ex)
            {
                result.data = ex;
                result.success = false;
                result.errorMsg = ex.Message;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }*/


    }

    //public class TableRefNoData
    //{
    //    public long RefID { get; set; }
    //    public string RefNo { get; set; }
    //    public string PartCode { get; set; }
    //    public string PartName { get; set; }
    //    public string Customer { get; set; }
    //    public string Model { get; set; }
    //    public string AXPartNo { get; set; }
    //    public string Status { get; set; }
    //    public Nullable<System.DateTime> IssueDate { get; set; }
    //    public string Remark { get; set; }
    //    public string Description { get; set; }
    //}

    //public class ProcessDetail
    //{
    //    //{ get; set; }
    //    public string Process { get; set; }
    //    public string ProcessID { get; set; }
    //    public int ProcessIndex { get; set; }
    //    public string Detail { get; set; }
    //}
}